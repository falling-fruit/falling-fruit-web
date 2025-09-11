import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AuthPage } from '../ui/PageTemplate'
import { Column } from './AuthWrappers'

export default function CheckEmailConfirmationPage() {
  const { t } = useTranslation()

  return (
    <AuthPage>
      <h2>{t('auth.check_email_header')}</h2>
      <p>{t('devise.confirmations.send_instructions')}</p>
      <Column>
        <Link to="/users/confirmation/new">
          {t('users.resend_confirmation_instructions')}
        </Link>
      </Column>
    </AuthPage>
  )
}
