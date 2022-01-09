import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useLocation } from 'react-router-dom'

import { setStreetView } from '../../redux/mapSlice'
import useRoutedTabs from '../../utils/useRoutedTabs'
import aboutRoutes from '../about/aboutRoutes'
import AccountPage from '../auth/AccountPage.js'
import authRoutes from '../auth/authRoutes'
import EntryWrapper from '../entry/EntryWrapper'
import { LocationForm } from '../form/LocationForm'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import { zIndex } from '../ui/GlobalStyle'
import { PageTabs, Tab, TabList, TabPanels } from '../ui/PageTabs'
import ListPage from './ListPage'
import { DEFAULT_TAB, getTabs } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  useTranslation()
  const tabs = getTabs()
  const dispatch = useDispatch()
  const streetView = useSelector((state) => state.map.streetView)
  const { pathname, state } = useLocation()
  const [tabIndex, handleTabChange] = useRoutedTabs(
    tabs.map(({ path }) => path),
    DEFAULT_TAB,
  )

  // const tabPanels = tabs.map(({ path, panel }) => (
  //   <TabPanel
  //     style={
  //       path.startsWith('/list') ? { paddingTop: '85px' } : { paddingTop: '0' }
  //     }
  //     key={path}
  //   >
  //     {panel}
  //   </TabPanel>
  // ))

  const tabList = tabs.map(({ path, icon, label }) => (
    <Tab key={path}>
      {icon}
      {label}
    </Tab>
  ))

  if (pathname.includes('list') || pathname.includes('setting')) {
    dispatch(setStreetView(false))
  }

  const isFromList = state?.fromPage === '/list'

  return (
    <PageTabs index={tabIndex} onChange={handleTabChange}>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>
      <TabPanels>
        <TopBarSwitch />
        <Switch>
          {aboutRoutes}
          {authRoutes}
          <Route path="/entry/new/details">
            <LocationForm stepped />
          </Route>
          <Route path="/entry/:id">
            <EntryWrapper />
          </Route>
          <Route path={['/map', '/entry', '/list', '/settings', '/entry/new']}>
            <Switch>
              <Route path="/entry/new" />
              <Route path="/entry/:id">
                {!streetView && <EntryWrapper isInDrawer />}
              </Route>
            </Switch>
            <Switch>
              <Route path="/list">
                <ListPage />
              </Route>
              <Route path="/settings">
                <SettingsPage />
              </Route>
              <Route path="/account">
                <AccountPage />
              </Route>
            </Switch>
            {/* {tabPanels} */}
          </Route>
        </Switch>
      </TabPanels>
      <Switch>
        <Route path={['/map', '/entry']}>
          {(pathname.includes('/map') || !isFromList) && <MapPage />}
        </Route>
      </Switch>
      <Switch>
        <Route path="/entry/new/details" />
        <Route>
          <TabList style={{ zIndex: zIndex.mobileTablist }}>{tabList}</TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
