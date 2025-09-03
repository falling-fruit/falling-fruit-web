import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { requestResetPassword } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import Column from '../ui/LinkColumn'
import { AuthPage } from '../ui/PageTemplate'
import { EmailForm } from './EmailForm'
import SignInLink from './SignInLink'
import { withAuthRedirect } from './withAuthRedirect'

const PasswordResetPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    try {
      await requestResetPassword(values)
      toast.success(t('devise.passwords.send_instructions'), {
        autoClose: 5000,
      })
      history.push('/auth/sign_in')
    } catch (error) {
      toast.error(
        t('error_message.auth.reset_password_failed', {
          message: error.message || t('error_message.unknown_error'),
        }),
      )
      recaptchaRef.current.reset()
    }
  }

  return (
    <AuthPage>
      <h1>{t('users.send_password_instructions')}</h1>
      <EmailForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      <Column>
        <Link to="/about/welcome">{t('glossary.about')}</Link>
        <SignInLink />
        <Link to="/auth/sign_up">{t('glossary.sign_up')}</Link>
        <Link to="/auth/confirmation/new">
          {t('users.resend_confirmation_instructions')}
        </Link>
      </Column>
    </AuthPage>
  )
}

export default withAuthRedirect(PasswordResetPage)
