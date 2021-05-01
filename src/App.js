import WindowSize from '@reach/window-size'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { LocationForm } from './components/form/LocationForm'
import MainPage from './components/MainPage'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route exact path="/form">
          <LocationForm />
        </Route>
        <Route exact path="/">
          <Redirect to="/map" />
        </Route>
        <Route>
          <MainPage />
        </Route>
      </Switch>
    </Router>
    <WindowSize>
      {(windowSize) => <GlobalStyle windowSize={windowSize} />}
    </WindowSize>
  </ThemeProvider>
)

export default App
