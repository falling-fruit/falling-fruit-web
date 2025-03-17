import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { withFromPage } from '../../utils/appUrl'

const SignInLink = () => {
  const { t } = useTranslation()

  return <Link to={withFromPage('/users/sign_in')}>{t('users.sign_in')}</Link>
}

export default SignInLink
