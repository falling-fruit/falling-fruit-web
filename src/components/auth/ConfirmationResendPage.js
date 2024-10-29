import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'

import { requestConfirmUser } from '../../utils/api'
import { pathWithCurrentView, withFromPage } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Column } from './AuthWrappers'
import { EmailForm } from './EmailForm'

const ConfirmationResendPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()
  const { t } = useTranslation()

  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && user) {
    toast.info('You are already signed in.')
    return <Redirect to={pathWithCurrentView('/map')} />
  }

  const handleSubmit = async (values) => {
    try {
      await requestConfirmUser(values)
      toast.success(t('devise.confirmations.send_instructions'), {
        autoClose: 5000,
      })
      history.push('/users/sign_in')
    } catch (e) {
      // Should not happen since API silently accepts any email
      toast.error(e.response?.data.error)
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageTemplate>
      <h1>{t('users.resend_confirmation_instructions')}</h1>
      <EmailForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      <Column>
        <Link to={withFromPage('/users/sign_in')}>{t('users.sign_in')}</Link>
        <Link to="/users/sign_up">{t('glossary.sign_up')}</Link>
        <Link to="/users/password/new">{t('users.forgot_password')}</Link>
      </Column>
    </PageTemplate>
  )
}

export default ConfirmationResendPage
