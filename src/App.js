import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import GlobalStyle, { theme } from './ui/GlobalStyle'
import Types from './pages/Types'
import ExamplePage from './pages/ExamplePage'

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
