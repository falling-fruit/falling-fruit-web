import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import DesktopLayout from './pages/desktop/DesktopLayout'
import MainPage from './pages/MainPage'
import MobileLayout from './pages/mobile/MobileLayout'

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
