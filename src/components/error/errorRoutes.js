import { Route } from 'react-router-dom'

import NetworkErrorPage from './NetworkErrorPage'
import SomethingWentWrongPage from './SomethingWentWrongPage'

const pages = [
  {
    path: ['/error/offline'],
    component: NetworkErrorPage,
  },
  {
    path: ['/error/fatal'],
    component: SomethingWentWrongPage,
  },
]

const errorRoutes = pages.map((props) => (
  <Route key={props.path[0]} {...props} />
))
export default errorRoutes
