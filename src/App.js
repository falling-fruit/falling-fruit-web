import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import DesktopLayout from './components/desktop/DesktopLayout'
import MainPage from './components/MainPage'
import MobileLayout from './components/mobile/MobileLayout'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route path="/desktop">
          <DesktopLayout />
        </Route>
        <Route path="/mobile">
          <MobileLayout />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
        <Route>Not found</Route>
      </Switch>
    </Router>
    <GlobalStyle />
  </ThemeProvider>
)

export default App
