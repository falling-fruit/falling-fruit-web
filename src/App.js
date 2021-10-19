import WindowSize from '@reach/window-size'
import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import Project from './components/about/Project'
//import TestPage from './components/about/TestPage'
import ComponentDemos from './components/ComponentDemos'
import Header from './components/desktop/Header'
import MainPage from './components/MainPage'
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
          <Route exact path="/about/project">
            <Header />
            <Project />
          </Route>
          <Route exact path="/demo">
            <ComponentDemos />
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
