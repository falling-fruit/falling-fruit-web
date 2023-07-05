import 'react-toastify/dist/ReactToastify.css'

import { WindowSize } from '@reach/window-size'
import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import MainPage from './components/MainPage'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import Toast from './components/ui/Toast'
import { store } from './redux/store'
import AuthInitializer from './utils/AuthInitializer'
import { ConnectedBreakpoint, useIsDesktop } from './utils/useBreakpoint'

const App = () => (
  <Provider store={store}>
    <AuthInitializer />
    <Toast
      position={useIsDesktop() ? 'bottom-right' : 'top-center'}
      autoClose={3000}
      closeOnClick
      rtl={false}
    />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/map" />
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
