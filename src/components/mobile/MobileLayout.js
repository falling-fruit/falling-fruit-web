import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'

import { setStreetView } from '../../redux/mapSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import aboutRoutes from '../about/aboutRoutes'
import AccountPage from '../auth/AccountPage'
import authRoutes from '../auth/authRoutes'
import connectRoutes from '../connect/connectRoutes'
import EntryWrapper from '../entry/EntryWrapper'
import { EditLocationForm } from '../form/EditLocation'
import { EditReviewForm } from '../form/EditReview'
import { LocationForm } from '../form/LocationForm'
import { ReviewForm } from '../form/ReviewForm'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import { zIndex } from '../ui/GlobalStyle'
import { PageTabs, TabList, TabPanels } from '../ui/PageTabs'
import ListPage from './ListPage'
import Tabs from './Tabs'
import TopBarSwitch from './TopBarSwitch'

const shouldDisplayMapPage = (pathname) => {
  // display the map for map endpoints
  if (matchPath(pathname, { path: '/map', exact: false, strict: false })) {
    return true
  }

  // additionally, also display in the background for some location pages
  const match = matchPath(pathname, {
    path: ['/locations/:entryId/:nextSegment', '/locations/:entryId'],
    exact: false,
    strict: false,
  })
  const isPlacingNewLocationMarker =
    match?.params.entryId === 'new' && match?.params.nextSegment !== 'details'

  const entryId = match?.params.entryId && parseInt(match.params.entryId)
  // distinguish viewing a location from having it displayed during e.g. editing or review
  const isViewingLocation =
    entryId && match.params.nextSegment?.indexOf('@') === 0
  return isPlacingNewLocationMarker || isViewingLocation
}
const MobileLayout = () => {
  const history = useAppHistory()
  const dispatch = useDispatch()
  const streetView = useSelector((state) => state.map.streetView)
  const { pathname } = useLocation()
  const { tabIndex, handleTabChange, tabContent } = Tabs()

  if (
    ['/list', '/settings', '/users/edit'].some((path) =>
      matchPath(pathname, { path, exact: false, strict: false }),
    )
  ) {
    dispatch(setStreetView(false))
  }

  return (
    <PageTabs index={tabIndex} onChange={handleTabChange}>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>
      <div
        style={{
          display: shouldDisplayMapPage(pathname) ? 'initial' : 'none',
          zIndex: 1,
        }}
      >
        <MapPage />
      </div>
      {connectRoutes}
      <TabPanels>
        <TopBarSwitch />
        <Switch>
          {aboutRoutes}
          {authRoutes}
          <Route path="/reviews/:reviewId/edit">
            {({ match }) => (
              <EditReviewForm stepped editingId={match.params.reviewId} />
            )}
          </Route>
          <Route path="/locations/:locationId/review">
            {({ match }) => (
              <ReviewForm
                stepped
                onSubmit={() =>
                  history.push(`/locations/${match.params.locationId}`)
                }
              />
            )}
          </Route>
          <Route path="/locations/:locationId/edit">
            {({ match }) => (
              <EditLocationForm editingId={match.params.locationId} />
            )}
          </Route>
          <Route path="/locations/new/details">
            <LocationForm />
          </Route>
          <Route path={['/map', '/locations', '/list', '/settings']}>
            <Switch>
              <Route path="/locations/new" />
              <Route path="/locations/:locationId">
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
            '/reviews/:reviewId/edit',
            '/locations/:locationId/review',
            '/locations/:locationId/edit',
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
            {tabContent}
          </TabList>
        </Route>
      </Switch>
    </PageTabs>
  )
}

export default MobileLayout
