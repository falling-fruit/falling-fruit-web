import { useTranslation } from 'react-i18next'

import { AuthPage } from '../ui/PageTemplate'
import AuthLinks from './AuthLinks'
import { withAuthRedirect } from './withAuthRedirect'

const CheckEmailConfirmationPage = () => {
  const { t } = useTranslation()

  return (
    <AuthPage>
      <h2>{t('devise.confirmations.confirm_your_email')}</h2>
      <p>{t('devise.confirmations.send_instructions')}</p>
      <AuthLinks include={['resendConfirmation']} />
    </AuthPage>
  )
}

export default withAuthRedirect(CheckEmailConfirmationPage)
