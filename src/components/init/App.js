import 'react-toastify/dist/ReactToastify.css'

import { WindowSize } from '@reach/window-size'
import { useTranslation } from 'react-i18next'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
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

const App = () => {
  useGoogleAnalytics()

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
export default App
