import WindowSize from '@reach/window-size'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import ComponentDemos from './components/ComponentDemos'
import MainPage from './components/MainPage'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import store from './store'

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/map" />
          </Route>
          <Route exact path="/demo">
            <ComponentDemos />
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
  </Provider>
)

export default App
