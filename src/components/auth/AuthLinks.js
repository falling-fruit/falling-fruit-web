import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { pathToSignInPage } from '../../utils/appUrl'
import Column from '../ui/LinkColumn'

const getAvailableLinks = (t) => ({
  about: {
    path: '/about/welcome',
    text: t('glossary.about'),
  },
  signIn: {
    path: pathToSignInPage(),
    text: t('users.sign_in'),
  },
  signUp: {
    path: '/auth/sign_up',
    text: t('glossary.sign_up'),
  },
  forgotPassword: {
    path: '/auth/password/new',
    text: t('users.forgot_password'),
  },
  resendConfirmation: {
    path: '/auth/confirmation/new',
    text: t('users.resend_confirmation_instructions'),
  },
})

const AuthLinks = ({ include, exclude, children }) => {
  const { t } = useTranslation()
  const availableLinks = getAvailableLinks(t)

  let linksToShow = Object.keys(availableLinks)

  if (include) {
    linksToShow = include.filter((key) => availableLinks[key])
  } else if (exclude) {
    linksToShow = linksToShow.filter((key) => !exclude.includes(key))
  }

  return (
    <Column>
      {linksToShow.map((linkKey) => {
        const linkConfig = availableLinks[linkKey]
        return (
          <Link key={linkKey} to={linkConfig.path}>
            {t(linkConfig.text)}
          </Link>
        )
      })}
      {children}
    </Column>
  )
}

export default AuthLinks
