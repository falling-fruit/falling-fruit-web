import 'react-toastify/dist/ReactToastify.css'

import { App as CapacitorApp } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'
import { WindowSize } from '@reach/window-size'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Provider } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { store } from '../../redux/store'
import { ConnectedBreakpoint, useIsDesktop } from '../../utils/useBreakpoint'
import { useGoogleAnalytics } from '../../utils/useGoogleAnalytics'
import DesktopLayout from '../desktop/DesktopLayout'
import MobileLayout from '../mobile/MobileLayout'
import GlobalStyle, { theme } from '../ui/GlobalStyle'
import Toast from '../ui/Toast'
import Auth from './Auth'
import redirectRoutes from './redirectRoutes'

const Layout = () => {
  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />

  return layout
}

const AppContent = () => {
  const isDesktop = useIsDesktop()
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <>
      <Auth />
      <Toast
        position={
          isDesktop ? (isRTL ? 'bottom-left' : 'bottom-right') : 'top-center'
        }
        autoClose={3000}
        closeOnClick
        rtl={isRTL}
      />
      <ThemeProvider theme={theme}>
        <Switch>
          {redirectRoutes}
          <Route>
            <Layout />
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

const AppWithRouter = () => {
  const history = useHistory()

  useEffect(() => {
    SplashScreen.hide()

    const handleAppUrlOpen = CapacitorApp.addListener('appUrlOpen', (data) => {
      try {
        const url = new URL(data.url)
        const path = url.pathname + url.search + url.hash
        history.push(path)
      } catch (error) {
        console.error('Error parsing app URL:', error)
      }
    })

    return () => {
      handleAppUrlOpen.remove()
    }
  }, []) //eslint-disable-line

  return <AppContent />
}

const App = () => {
  useGoogleAnalytics()

  return (
    <Provider store={store}>
      <AppWithRouter />
    </Provider>
  )
}
export default App
