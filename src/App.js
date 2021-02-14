import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Types from './pages/Types'
import MapPage from './pages/MapPage/MapPage.js'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/types">
        <Types />
      </Route>
      <Route exact path="/">
        <MapPage />
      </Route>
      <Route>Not found</Route>
    </Switch>
  </Router>
)

export default App
