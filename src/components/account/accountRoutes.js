import { Route } from 'react-router-dom'

import AccountPage from './AccountPage'
import ChangeEmailPage from './ChangeEmailPage'
import ChangePasswordPage from './ChangePasswordPage'

const pages = [
  {
    path: '/account/edit',
    component: AccountPage,
  },
  {
    path: '/account/change-password',
    component: ChangePasswordPage,
  },
  {
    path: '/account/change-email',
    component: ChangeEmailPage,
  },
]

export const accountPages = pages

const accountRoutes = pages.map((props) => (
  <Route key={props.path} {...props} />
))
export default accountRoutes
