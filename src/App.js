import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import MainPage from './pages/MainPage'
import MapPage from './pages/MapPage'
import MobileLayout from './pages/mobile/MobileLayout'
import Types from './pages/Types'

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route exact path="/types">
          <Types />
        </Route>
        <Route exact path="/map">
          <MapPage />
        </Route>
        <Route exact path="/mobile">
          <MobileLayout />
        </Route>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route>Not found</Route>
      </Switch>
    </Router>
    <GlobalStyle />
  </ThemeProvider>
)

export default App
