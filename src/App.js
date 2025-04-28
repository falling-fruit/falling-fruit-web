import 'react-toastify/dist/ReactToastify.css'

import { WindowSize } from '@reach/window-size'
import { useTranslation } from 'react-i18next'
import { Provider, useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import MainPage from './components/MainPage'
import GlobalStyle, { theme } from './components/ui/GlobalStyle'
import Toast from './components/ui/Toast'
import { store } from './redux/store'
import { pathWithCurrentView } from './utils/appUrl'
import AuthInitializer from './utils/AuthInitializer'
import { ConnectedBreakpoint, useIsDesktop } from './utils/useBreakpoint'
import { useGoogleAnalytics } from './utils/useGoogleAnalytics'

const HomeRedirect = () => {
  const { user, isLoading } = useSelector((state) => state.auth)
  if (isLoading) {
    return null
  } else if (user) {
    return <Redirect to={pathWithCurrentView('/map')} />
  } else {
    return <Redirect to="/users/sign_in" />
  }
}

const AppContent = () => {
  const isDesktop = useIsDesktop()
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <>
      <AuthInitializer />
      <Toast
        position={isDesktop ? 'bottom-right' : 'top-center'}
        autoClose={3000}
        closeOnClick
        rtl={isRTL}
      />
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <HomeRedirect />
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
    </>
  )
}

const App = () => {
  useGoogleAnalytics()

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
export default App
