import { Route } from 'react-router-dom'

import { AboutDatasetPage } from './AboutDatasetPage'
import ImportedDatasetsPage from './ImportedDatasetsPage'
import InThePressPage from './InThePressPage'
import ProjectPage from './ProjectPage'

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
    path: '/about/dataset',
    component: ImportedDatasetsPage,
  },
  {
    path: '/about/press',
    component: InThePressPage,
  },
]

const aboutRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default aboutRoutes
