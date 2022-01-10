import { Route } from 'react-router-dom'

import AuthSwitch from './AuthSwitch'
import ConfirmationPage from './ConfirmationPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import LoginPage from './LoginPage'
import PasswordResetPage from './PasswordResetPage'
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
    // TODO: Change to AccountPage, and split authRoutes into mobile/desktop versions
    component: AuthSwitch,
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

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
