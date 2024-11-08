import { Route } from 'react-router-dom'

import UserProfile from './UserProfile.js'

const pages = [
  {
    path: ['/users/:id'],
    component: UserProfile,
  },
]

const profileRoutes = pages.map((props) => (
  <Route key={props.path[0]} {...props} />
))
console.log(profileRoutes)
export default profileRoutes
