import { Route } from 'react-router-dom'

import HomePage from './HomePage'

const pages = [
  {
    path: '/about/welcome',
    component: HomePage,
  },
]

export const homePages = pages

const homeRoutes = pages.map((props) => <Route key={props.path} {...props} />)
export default homeRoutes
