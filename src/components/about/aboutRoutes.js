import { Route } from 'react-router-dom'

import { AboutDatasetPage } from './AboutDatasetPage'
import DataPage from './DataPage'
import InThePressPage from './InThePressPage'
import ProjectPage from './ProjectPage'
import ShareTheHarvestPage from './ShareTheHarvestPage'

const pages = [
  {
    path: ['/about/about-the-project'],
    component: ProjectPage,
  },
  {
    path: ['/imports/:id'],
    component: AboutDatasetPage,
  },
  {
    path: ['/about/the-data'],
    component: DataPage,
  },
  {
    path: ['/about/in-the-press'],
    component: InThePressPage,
  },
  {
    path: ['/about/sharing-the-harvest'],
    component: ShareTheHarvestPage,
  },
]

const aboutRoutes = pages.map((props) => (
  <Route key={props.path[0]} {...props} />
))
export default aboutRoutes
