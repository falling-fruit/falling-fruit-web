import { Route } from 'react-router-dom'

import AuthSwitch from './AuthSwitch'
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
]

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
