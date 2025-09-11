import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { requestConfirmUser } from '../../utils/api'
import { AuthPage } from '../ui/PageTemplate'
import { Column } from './AuthWrappers'
import { EmailForm } from './EmailForm'

export default function CheckEmailConfirmation() {
  const recaptchaRef = useRef()
  const { t } = useTranslation()

  const handleResend = async (values) => {
    try {
      await requestConfirmUser(values)
      toast.success(t('devise.confirmations.send_instructions'), {
        autoClose: 5000,
      })
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
      <h2>Check your email for confirmation message</h2>
      <p>{t('devise.confirmations.send_instructions')}</p>
      <EmailForm onSubmit={handleResend} recaptchaRef={recaptchaRef} />
      <Column>{/* Add any additional links or info if needed */}</Column>
    </AuthPage>
  )
}
