import { Route } from 'react-router-dom'

import AccountPage from './AccountPage'
import ConfirmationPage from './ConfirmationPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import LoginPage from './LoginPage'
import PasswordResetPage from './PasswordResetPage'
import PasswordSetPage from './PasswordSetPage'
import SignupPage from './SignupPage'

const pages = [
  {
    path: '/account',
    component: AccountPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/signup',
    component: SignupPage,
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
  {
    path: '/confirmation',
    component: ConfirmationPage,
  },
]

// TODO: Delete export once tabs work off route
export const authPages = pages

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
