import { Route } from 'react-router-dom'

import CheckEmailConfirmationPage from './CheckEmailConfirmationPage'
import ConfirmationPage from './ConfirmationPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import HomePage from './HomePage'
import PasswordResetPage from './PasswordResetPage'
import PasswordSetPage from './PasswordSetPage'
import SignInPage from './SignInPage'
import SignupPage from './SignupPage'

const pages = [
  {
    path: '/about/welcome',
    component: HomePage,
  },
  {
    path: '/auth/sign_in',
    component: SignInPage,
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
    path: '/auth/confirmation/check-email',
    component: CheckEmailConfirmationPage,
  },
  {
    path: '/auth/confirmation/new',
    component: ConfirmationResendPage,
  },
  {
    path: '/auth/confirmation',
    component: ConfirmationPage,
  },
]

export const authPages = pages

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
