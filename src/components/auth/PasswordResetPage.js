import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'

import { requestResetPassword } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Column } from './AuthWrappers'
import { EmailForm } from './EmailForm'

const PasswordResetPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()
  const { t } = useTranslation()
  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  const handleSubmit = async (values) => {
    try {
      await requestResetPassword(values)
      toast.success(t('devise.passwords.send_instructions'), {
        autoClose: 5000,
      })
      history.push('/users/sign_in')
    } catch (e) {
      // Should not happen since API silently accepts any email
      toast.error(e.response?.data?.error)
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageTemplate>
      <h1>{t('users.send_password_instructions')}</h1>
      <EmailForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      <Column>
        <Link to="/users/sign_in">{t('users.sign_in')}</Link>
        <Link to="/users/sign_up">{t('glossary.sign_up')}</Link>
        <Link to="/users/confirmation/new">
          {t('users.resend_confirmation_instructions')}
        </Link>
      </Column>
    </PageTemplate>
  )
}

export default PasswordResetPage
