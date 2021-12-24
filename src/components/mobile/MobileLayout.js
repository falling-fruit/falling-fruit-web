import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useLocation } from 'react-router-dom'

import { enableStreetView } from '../../redux/mapSlice'
import useRoutedTabs from '../../utils/useRoutedTabs'
import aboutRoutes from '../about/aboutRoutes'
import authRoutes from '../auth/authRoutes'
import EntryWrapper from '../entry/EntryWrapper'
import { LocationForm } from '../form/LocationForm'
import { zIndex } from '../ui/GlobalStyle'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { DEFAULT_TAB, getTabs } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  useTranslation()
  const tabsRef = useRef()
  const tabs = getTabs()
  const dispatch = useDispatch()
  const streetView = useSelector((state) => state.map.streetView)
  const location = useLocation()
  const [tabIndex, handleTabChange] = useRoutedTabs(
    tabs.map(({ path }) => path),
    DEFAULT_TAB,
  )

  const tabPanels = tabs.map(({ path, panel }) => (
    <TabPanel
      style={path === '/list' ? { paddingTop: '85px' } : { paddingTop: '0' }}
      key={path}
    >
      {panel}
    </TabPanel>
  ))

  const tabList = tabs.map(({ path, icon, label }) => (
    <Tab key={path}>
      {icon}
      {label}
    </Tab>
  ))

  useEffect(() => {
    if (
      location.pathname.includes('list') ||
      location.pathname.includes('setting')
    ) {
      return dispatch(enableStreetView({ streetView: false }))
    }
  }, [dispatch, location])

  useEffect(() => {
    const tabsRefCopy = tabsRef.current
    disableBodyScroll(tabsRefCopy)

    return () => enableBodyScroll(tabsRefCopy)
  }, [])

  return (
    <PageTabs index={tabIndex} onChange={handleTabChange} ref={tabsRef}>
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
          <Route path="/map/entry/new/details">
            <LocationForm />
          </Route>
          <Route path="/list/entry/:id">
            <EntryWrapper />
          </Route>
          <Route path={['/map', '/list', '/settings', '/map/entry/new']}>
            <Switch>
              <Route path="/map/entry/new" />
              <Route path="/map/entry/:id">
                {!streetView && <EntryWrapper isInDrawer />}
              </Route>
            </Switch>
            {tabPanels}
          </Route>
        </Switch>
      </TabPanels>
      <Switch>
        <Route path="/map/entry/new/details" />
        <Route>
          <TabList style={{ zIndex: zIndex.mobileTablist }}>{tabList}</TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
