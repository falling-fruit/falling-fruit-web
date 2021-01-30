import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ExamplePage from './pages/ExamplePage'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <ExamplePage />
      </Route>
      <Route>Not found</Route>
    </Switch>
  </Router>
)

export default App
