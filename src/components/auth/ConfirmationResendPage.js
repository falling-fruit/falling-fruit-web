import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { requestConfirmUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { AuthPage } from '../ui/PageTemplate'
import AuthLinks from './AuthLinks'
import { EmailForm } from './EmailForm'
import { withAuthRedirect } from './withAuthRedirect'

const ConfirmationResendPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    try {
      await requestConfirmUser(values)
      toast.success(t('devise.confirmations.send_instructions'), {
        autoClose: 5000,
      })
      history.push('/auth/sign_in')
    } catch (error) {
      toast.error(
        t('error_message.auth.resend_confirmation_failed', {
          message: error.message || t('error_message.unknown_error'),
        }),
      )
      recaptchaRef.current.reset()
    }
  }

  return (
    <AuthPage>
      <h1>{t('users.resend_confirmation_instructions')}</h1>
      <EmailForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      <AuthLinks exclude={['resendConfirmation']} />
    </AuthPage>
  )
}

export default withAuthRedirect(ConfirmationResendPage)
