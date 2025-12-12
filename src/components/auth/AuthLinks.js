import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { pathToSignInPage } from '../../utils/appUrl'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Column from '../ui/LinkColumn'

const getAvailableLinks = (t) => ({
  about: {
    path: '/about/welcome',
    text: t('pages.welcome.home_page'),
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
    text: t('users.reset_password'),
  },
  resendConfirmation: {
    path: '/auth/confirmation/new',
    text: t('users.resend_confirmation_instructions'),
  },
})

const AuthLinks = ({ include, exclude }) => {
  const { t } = useTranslation()
  const availableLinks = getAvailableLinks(t)
  const isDesktop = useIsDesktop()

  let linksToShow = Object.keys(availableLinks)

  if (include) {
    linksToShow = include.filter((key) => availableLinks[key])
  } else if (exclude) {
    linksToShow = linksToShow.filter((key) => !exclude.includes(key))
  }

  if (isDesktop) {
    linksToShow = linksToShow.filter((key) => key !== 'about')
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
    </Column>
  )
}

export default AuthLinks
