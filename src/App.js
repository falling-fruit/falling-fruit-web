import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import ExamplePage from './pages/ExamplePage'
import Types from './pages/Types'

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <Route exact path="/types">
          <Types />
        </Route>
        <Route exact path="/">
          <ExamplePage />
        </Route>
        <Route>Not found</Route>
      </Switch>
    </Router>
    <GlobalStyle />
  </ThemeProvider>
)

export default App
