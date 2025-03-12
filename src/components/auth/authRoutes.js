import { Route } from 'react-router-dom'

import UserProfile from '../profile/UserProfile'
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
  {
    path: ['/users/:id'],
    component: UserProfile,
  },
]

export const authPages = pages

const authTabPaths = ['edit', 'sign_in', 'sign_up', 'password', 'confirmation']

export const isTabPath = (path) =>
  authTabPaths.some(
    (tabPath) => path === tabPath || path?.startsWith(`${tabPath}/`),
  )

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
