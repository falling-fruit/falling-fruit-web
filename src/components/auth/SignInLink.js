import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { pathToSignInPage } from '../../utils/appUrl'

const SignInLink = () => {
  const { t } = useTranslation()

  return <Link to={pathToSignInPage()}>{t('users.sign_in')}</Link>
}

export default SignInLink
