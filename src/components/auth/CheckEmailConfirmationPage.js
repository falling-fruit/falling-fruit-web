import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Column from '../ui/LinkColumn'
import { AuthPage } from '../ui/PageTemplate'
import { withAuthRedirect } from './withAuthRedirect'

const CheckEmailConfirmationPage = () => {
  const { t } = useTranslation()

  return (
    <AuthPage>
      <h2>{t('devise.confirmations.confirm_your_email')}</h2>
      <p>{t('devise.confirmations.send_instructions')}</p>
      <Column>
        <Link to="/users/confirmation/new">
          {t('users.resend_confirmation_instructions')}
        </Link>
      </Column>
    </AuthPage>
  )
}

export default withAuthRedirect(CheckEmailConfirmationPage)
