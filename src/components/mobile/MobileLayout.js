import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'

import { setStreetView } from '../../redux/mapSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import useRoutedTabs from '../../utils/useRoutedTabs'
import aboutRoutes from '../about/aboutRoutes'
import AccountPage from '../auth/AccountPage'
import authRoutes from '../auth/authRoutes'
import EntryWrapper from '../entry/EntryWrapper'
import { EditLocationForm, EditReviewForm } from '../form/EditableForm'
import { LocationForm } from '../form/LocationForm'
import { ReviewForm } from '../form/ReviewForm'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import { zIndex } from '../ui/GlobalStyle'
import { PageTabs, Tab, TabList, TabPanels } from '../ui/PageTabs'
import ListPage from './ListPage'
import { DEFAULT_TAB, useTabs } from './tabs'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => {
  const history = useAppHistory()
  const tabs = useTabs()
  const dispatch = useDispatch()
  const streetView = useSelector((state) => state.map.streetView)
  const { pathname, state } = useLocation()
  const [tabIndex, handleTabChange] = useRoutedTabs(
    tabs.map(({ paths }) => paths),
    DEFAULT_TAB,
  )

  const tabList = tabs.map(({ paths, icon, label }) => (
    <Tab key={paths[0]}>
      {icon}
      {label}
    </Tab>
  ))

  if (
    ['/list', '/settings', '/users/edit'].some((path) =>
      matchPath(pathname, { path, exact: false, strict: false }),
    )
  ) {
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
          <Route path="/reviews/:id/edit">
            {({ match }) => (
              <EditReviewForm stepped editingId={match.params.id} />
            )}
          </Route>
          <Route path="/locations/:id/review">
            {({ match }) => (
              <ReviewForm
                stepped
                onSubmit={() => history.push(`/locations/${match.params.id}`)}
              />
            )}
          </Route>
          <Route path="/locations/:id/edit">
            {({ match }) => <EditLocationForm editingId={match.params.id} />}
          </Route>
          <Route path="/locations/new/details">
            <LocationForm />
          </Route>
          <Route path={['/map', '/locations', '/list', '/settings']}>
            <Switch>
              <Route path="/locations/new" />
              <Route path="/locations/:id">
                {!streetView && <EntryWrapper />}
              </Route>
            </Switch>
            <Switch>
              <Route path="/list">
                <ListPage />
              </Route>
              <Route path="/settings">
                <SettingsPage />
              </Route>
              <Route path="/users/edit">
                <AccountPage />
              </Route>
            </Switch>
          </Route>
        </Switch>
      </TabPanels>
      <Switch>
        <Route
          path={[
            '/reviews/:id/edit',
            '/locations/:id/review',
            '/locations/:id/edit',
            '/locations/new/details',
          ]}
        />
        <Route path={['/map', '/locations']}>
          {(pathname.includes('/map') || !isFromList) && <MapPage />}
        </Route>
      </Switch>
      <Switch>
        <Route
          path={[
            '/reviews/:id/edit',
            '/locations/:id/review',
            '/locations/:id/edit',
            '/locations/new/details',
          ]}
        />
        <Route>
          <TabList
            style={{
              zIndex: zIndex.mobileTablist,
              position: 'fixed',
              width: '100%',
              bottom: 0,
            }}
          >
            {tabList}
          </TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
