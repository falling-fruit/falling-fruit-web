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
    path: '/users/edit',
    component: AccountPage,
  },
  {
    path: '/users/sign_in',
    component: LoginPage,
  },
  {
    path: '/users/sign_up',
    component: SignupPage,
  },
  {
    path: '/users/password/new',
    component: PasswordResetPage,
  },
  {
    path: '/users/password/edit',
    component: PasswordSetPage,
  },
  {
    path: '/users/confirmation/new',
    component: ConfirmationResendPage,
  },
  {
    path: '/users/confirmation',
    component: ConfirmationPage,
  },
]

export const authPages = pages

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
