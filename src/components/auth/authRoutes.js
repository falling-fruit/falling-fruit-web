import { Route } from 'react-router-dom'

import AccountPage from './AccountPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import PasswordResetPage from './ConfirmationResendPage'
import LoginPage from './LoginPage'
import PasswordSetPage from './PasswordSetPage'
import SignupPage from './SignupPage'

const pages = [
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/signup',
    component: SignupPage,
  },
  {
    path: '/account',
    component: AccountPage,
  },
  {
    path: '/password/reset',
    component: PasswordResetPage,
  },
  {
    path: '/password/set',
    component: PasswordSetPage,
  },
  {
    path: '/confirmation/new',
    component: ConfirmationResendPage,
  },
]

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
