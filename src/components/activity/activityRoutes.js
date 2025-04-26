import { Route } from 'react-router-dom'

import RecentChangesPage from './RecentChangesPage'
import UserActivityPage from './UserActivityPage'

const pages = [
  {
    path: '/activity/:userId',
    component: UserActivityPage,
  },
  {
    path: '/changes',
    component: RecentChangesPage,
  },
]

const activityRoutes = pages.map((props) => (
  <Route key={props.path} {...props} />
))
export default activityRoutes
