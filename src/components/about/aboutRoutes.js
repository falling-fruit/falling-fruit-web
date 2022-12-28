import { Route } from 'react-router-dom'

import { AboutDatasetPage } from './AboutDatasetPage'
import DataPage from './DataPage'
import InThePressPage from './InThePressPage'
import ProjectPage from './ProjectPage'
import ShareTheHarvestPage from './ShareTheHarvestPage'

const pages = [
  {
    path: '/about/project',
    component: ProjectPage,
  },
  {
    path: '/about/dataset/:id',
    component: AboutDatasetPage,
  },
  {
    path: '/about/data',
    component: DataPage,
  },
  {
    path: '/about/press',
    component: InThePressPage,
  },
  {
    path: '/about/share',
    component: ShareTheHarvestPage,
  },
]

const aboutRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default aboutRoutes
