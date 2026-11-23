import { Route } from 'react-router-dom'

import OpenReportsPage from './OpenReportsPage'
import ResolvedReportsPage from './ResolvedReportsPage'
import TypesPage from './TypesPage'

const pages = [
  {
    path: '/admin/reports/open',
    component: OpenReportsPage,
  },
  {
    path: '/admin/reports/resolved',
    component: ResolvedReportsPage,
  },
  {
    path: '/admin/types/:typeId?',
    component: TypesPage,
  },
]

export const adminPages = pages

const adminRoutes = pages.map((props) => <Route key={props.path} {...props} />)

export default adminRoutes
