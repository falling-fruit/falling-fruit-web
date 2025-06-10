import { Route } from 'react-router-dom'

import CheckEmailConfirmationPage from './CheckEmailConfirmationPage'
import ConfirmationPage from './ConfirmationPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import LoginPage from './LoginPage'
import PasswordResetPage from './PasswordResetPage'
import PasswordSetPage from './PasswordSetPage'
import SignupPage from './SignupPage'

const pages = [
  {
    path: '/auth/sign_in',
    component: LoginPage,
  },
  {
    path: '/auth/sign_up',
    component: SignupPage,
  },
  {
    path: '/auth/password/new',
    component: PasswordResetPage,
  },
  {
    path: '/auth/password/edit',
    component: PasswordSetPage,
  },
  {
    path: '/auth/confirmation/new',
    component: ConfirmationResendPage,
  },
  {
    path: '/auth/confirmation',
    component: ConfirmationPage,
  },
  {
    path: '/auth/confirmation/check-email',
    component: CheckEmailConfirmationPage,
  },
]

export const authPages = pages

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
