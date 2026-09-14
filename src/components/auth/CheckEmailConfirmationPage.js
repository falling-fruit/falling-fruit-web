import { useTranslation } from 'react-i18next'

import { PageHeader } from '../ui/Headers'
import { AuthPage } from '../ui/PageTemplate'
import AuthLinks from './AuthLinks'
import { withAuthRedirect } from './withAuthRedirect'

const CheckEmailConfirmationPage = () => {
  const { t } = useTranslation()

  return (
    <AuthPage>
      <PageHeader>{t('devise.confirmations.confirm_your_email')}</PageHeader>
      <p>{t('devise.confirmations.send_instructions')}</p>
      <AuthLinks include={['resendConfirmation']} />
    </AuthPage>
  )
}

export default withAuthRedirect(CheckEmailConfirmationPage)
