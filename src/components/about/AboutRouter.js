import { Route } from 'react-router-dom'

import ImportedDatasetsPage from '../about/ImportedDatasetsPage'
import ProjectPage from './ProjectPage'

const pages = [
  {
    path: '/about/project',
    component: ProjectPage,
  },
  /* {
    path: '/about/dataset/{id}',
    component = AboutDatasetPage,
  },*/
  {
    path: '/about/dataset',
    component: ImportedDatasetsPage,
  },
]

const aboutRoutes = pages.map((props) => <Route key={props.path} {...props} />)

export default aboutRoutes
