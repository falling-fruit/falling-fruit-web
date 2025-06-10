import { Route } from 'react-router-dom'

import UserProfile from './UserProfile'

const pages = [
  {
    path: ['/users/:id'],
    component: UserProfile,
  },
]

const profileRoutes = pages.map((props) => (
  <Route key={props.path} {...props} />
))
export default profileRoutes
