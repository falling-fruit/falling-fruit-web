import { Route } from 'react-router-dom'

import AccountPage from './AccountPage'
import LoginPage from './LoginPage'
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
]

const authRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default authRoutes
