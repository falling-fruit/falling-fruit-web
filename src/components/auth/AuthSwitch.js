import { useSelector } from 'react-redux'

import LoadingIndicator from '../ui/LoadingIndicator'
import AccountPage from './AccountPage'
import LoginPage from './LoginPage'

const AuthSwitch = () => {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return <LoadingIndicator cover vertical />
  }

  if (!isLoading && !user) {
    return <LoginPage />
  }

  return <AccountPage />
}

export default AuthSwitch
