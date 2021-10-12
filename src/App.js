import WindowSize from '@reach/window-size'
import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import ComponentDemos from './components/ComponentDemos'
import MainPage from './components/MainPage'
import TestPage from './components/template/TestPage'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import { store } from './redux/store'
import { ConnectedBreakpoint } from './utils/useBreakpoint'

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/map" />
          </Route>
          <Route exact path="/demo">
            <ComponentDemos />
          </Route>
          <Route exact path="/testpage">
            <TestPage />
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
  </Provider>
)

export default App
