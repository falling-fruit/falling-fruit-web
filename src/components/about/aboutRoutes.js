import { Route } from 'react-router-dom'

import { AboutDatasetPage } from './AboutDatasetPage'
import DataPage from './DataPage'
import InThePressPage from './InThePressPage'
import ProjectPage from './ProjectPage'
import ShareTheHarvestPage from './ShareTheHarvestPage'

const pages = [
  {
    path: ['/about'],
    component: ProjectPage,
  },
  {
    path: ['/imports/:id'],
    component: AboutDatasetPage,
  },
  {
    path: ['/data', '/datasets'],
    component: DataPage,
  },
  {
    path: ['/press'],
    component: InThePressPage,
  },
  {
    path: ['/sharing'],
    component: ShareTheHarvestPage,
  },
]

const aboutRoutes = pages.map((props) => (
  <Route key={props.path[0]} {...props} />
))
export default aboutRoutes
