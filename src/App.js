import WindowSize from '@reach/window-size'
import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import ComponentDemos from './components/ComponentDemos'
import LoginPage from './components/LoginPage'
import MainPage from './components/MainPage'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import { store } from './redux/store'
import AuthInitializer from './utils/AuthInitializer'
import { ConnectedBreakpoint } from './utils/useBreakpoint'

const App = () => (
  <Provider store={store}>
    <AuthInitializer>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/map" />
            </Route>
            <Route exact path="/demo">
              <ComponentDemos />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>

            <Route>
              <MainPage />
            </Route>
          </Switch>
          <WindowSize>
            {(windowSize) => <GlobalStyle windowSize={windowSize} />}
          </WindowSize>
          <ConnectedBreakpoint />
        </ThemeProvider>
      </BrowserRouter>
    </AuthInitializer>
  </Provider>
)

export default App
