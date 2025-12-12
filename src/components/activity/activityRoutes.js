import { Route } from 'react-router-dom'

import RecentActivityPage from './RecentActivityPage'
import UserActivityPage from './UserActivityPage'
import UserProfile from './UserProfile'

const pages = [
  {
    path: '/users/:userId/activity',
    component: UserActivityPage,
  },
  {
    path: ['/users/:userId'],
    component: UserProfile,
  },
  {
    path: '/changes',
    component: RecentActivityPage,
  },
]

const activityRoutes = pages.map((props) => (
  <Route key={props.path} {...props} />
))
export default activityRoutes
