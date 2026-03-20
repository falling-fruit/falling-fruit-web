import { Route } from 'react-router-dom'

import SavedListsPage from './SavedListsPage'

const pages = [
  {
    path: ['/lists'],
    component: SavedListsPage,
  },
]

const savedRoutes = [
  ...pages.map((props) => <Route key={props.path[0]} {...props} />),
]

export default savedRoutes
