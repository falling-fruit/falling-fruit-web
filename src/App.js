import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import ExamplePage from './pages/ExamplePage'
import Map from './pages/MapPage/MapPage'
import Types from './pages/Types'

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route exact path="/types">
          <Types />
        </Route>
        <Route exact path="/">
          <Map />
        </Route>
        <Route exact path="/examplePage">
          <ExamplePage />
        </Route>
        <Route>Not found</Route>
      </Switch>
    </Router>
    <GlobalStyle />
  </ThemeProvider>
)

export default App
