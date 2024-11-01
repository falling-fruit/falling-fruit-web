import { Route } from 'react-router-dom'

import ActivityPage from './ActivityPage'

const pages = [
  {
    path: ['/changes'],
    component: ActivityPage,
  },
]

const activityRoutes = pages.map((props) => (
  <Route key={props.path[0]} {...props} />
))
export default activityRoutes
