import { useSelector } from 'react-redux'

import Spinner from '../ui/Spinner'
import AccountPage from './AccountPage'
import LoginPage from './LoginPage'

const AuthSwitch = () => {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return <Spinner />
  }

  if (!isLoading && !user) {
    return <LoginPage />
  }

  return <AccountPage />
}

export default AuthSwitch
