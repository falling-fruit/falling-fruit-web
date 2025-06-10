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
import { addParam, pathWithCurrentView, pathWithView } from './utils/appUrl'
import AuthInitializer from './utils/AuthInitializer'
import { ConnectedBreakpoint, useIsDesktop } from './utils/useBreakpoint'
import { useGoogleAnalytics } from './utils/useGoogleAnalytics'

const EmbedRedirect = () => {
  const mapPath = pathWithCurrentView('/map')
  const pathWithEmbed = addParam(mapPath, 'embed', 'true')
  return <Redirect to={pathWithEmbed} />
}

const DumpstersRedirect = () => {
  const mapPath = pathWithCurrentView('/map')
  const pathWithCategory = addParam(mapPath, 'c', 'freegan')
  return <Redirect to={pathWithCategory} />
}

const GrafterRedirect = () => {
  const mapPath = pathWithCurrentView('/map')
  const pathWithCategory = addParam(mapPath, 'c', 'grafter')
  return <Redirect to={pathWithCategory} />
}

const CommunityFruitTreesRedirect = () => {
  const view = {
    center: { lat: 38.48128, lng: -99.09492 },
    zoom: 5,
  }
  let mapPath = pathWithView('/map', view)
  mapPath = addParam(mapPath, 'f', '4628')
  return <Redirect to={mapPath} />
}

const SeedLibraryRedirect = () => {
  const view = {
    center: { lat: 38.48128, lng: -99.09492 },
    zoom: 5,
  }
  let mapPath = pathWithView('/map', view)
  mapPath = addParam(mapPath, 'f', '3082')
  return <Redirect to={mapPath} />
}

const HomeRedirect = () => {
  const { user, isLoading } = useSelector((state) => state.auth)
  if (isLoading) {
    return null
  } else if (user) {
    return <Redirect to={pathWithCurrentView('/map')} />
  } else {
    return <Redirect to="/auth/sign_in" />
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
        position={
          isDesktop ? (isRTL ? 'bottom-left' : 'bottom-right') : 'top-center'
        }
        autoClose={3000}
        closeOnClick
        rtl={isRTL}
      />
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <HomeRedirect />
          </Route>
          <Route path="/locations/embed">
            <EmbedRedirect />
          </Route>
          <Route path={['/dumpsters', '/freegan']}>
            <DumpstersRedirect />
          </Route>
          <Route path="/grafter">
            <GrafterRedirect />
          </Route>
          <Route path="/communityfruittrees">
            <CommunityFruitTreesRedirect />
          </Route>
          <Route path={['/seedlibrary', '/seedlibraries']}>
            <SeedLibraryRedirect />
          </Route>
          <Route path="/users/sign_in">
            <Redirect to={pathWithCurrentView('/auth/sign_in')} />
          </Route>
          <Route path="/users/sign_up">
            <Redirect to={pathWithCurrentView('/auth/sign_up')} />
          </Route>
          <Route path="/users/password/new">
            <Redirect to={pathWithCurrentView('/auth/password/new')} />
          </Route>
          <Route path="/users/password/edit">
            <Redirect to={pathWithCurrentView('/auth/password/edit')} />
          </Route>
          <Route path="/users/confirmation/new">
            <Redirect to={pathWithCurrentView('/auth/confirmation/new')} />
          </Route>
          <Route path="/users/confirmation">
            <Redirect to={pathWithCurrentView('/auth/confirmation')} />
          </Route>
          <Route path="/users/edit">
            <Redirect to={pathWithCurrentView('/account/edit')} />
          </Route>
          <Route path="/users/change-password">
            <Redirect to={pathWithCurrentView('/account/change-password')} />
          </Route>
          <Route path="/users/change-email">
            <Redirect to={pathWithCurrentView('/account/change-email')} />
          </Route>
          <Route
            path={['/home', '/locations/home', '/routes', '/routes/:routeId']}
          >
            <Redirect to={pathWithCurrentView('/map')} />
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
