import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { pathToSignInPage } from '../../utils/appUrl'

const withRedirectToAuth = (WrappedComponent) => {
  const WithRedirectToAuth = (props) => {
    const { user, isLoading } = useSelector((state) => state.auth)
    const isLoggedIn = !!user

    if (!isLoggedIn && !isLoading) {
      return <Redirect to={pathToSignInPage()} />
    }

    return <WrappedComponent {...props} />
  }

  WithRedirectToAuth.displayName = `WithRedirectToAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return WithRedirectToAuth
}

export default withRedirectToAuth
