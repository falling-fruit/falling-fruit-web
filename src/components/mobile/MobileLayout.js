import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'

import aboutRoutes from '../about/aboutRoutes'
import AccountPage from '../auth/AccountPage'
import authRoutes from '../auth/authRoutes'
import connectRoutes from '../connect/connectRoutes'
import EntryMobile from '../entry/EntryMobile'
import { EditLocationForm } from '../form/EditLocation'
import { EditReviewForm } from '../form/EditReview'
import { LocationForm } from '../form/LocationForm'
import { ReviewForm } from '../form/ReviewForm'
import ListPage from '../list/ListPage'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import { zIndex } from '../ui/GlobalStyle'
import { PageTabs, TabList, TabPanels } from '../ui/PageTabs'
import Tabs from './Tabs'
import TopBarSwitch from './TopBarSwitch'

const shouldDisplayMapPage = (pathname) => {
  if (matchPath(pathname, { path: '/map', exact: false, strict: false })) {
    return true
  }

  const match = matchPath(pathname, {
    path: [
      '/locations/:locationId/:nextSegment/:nextNextSegment',
      '/locations/:locationId/:nextSegment',
      '/locations/:locationId',
    ],
    exact: false,
    strict: false,
  })

  const isPlacingNewLocationMarker = match?.params.locationId === 'init'

  const locationId =
    match?.params.locationId && parseInt(match.params.locationId)
  const isViewingLocation =
    locationId && match.params.nextSegment?.indexOf('@') === 0

  const isEditingLocationMarker =
    locationId &&
    match.params.nextSegment === 'edit' &&
    match.params.nextNextSegment === 'position'

  const isViewingPanorama =
    locationId && match.params.nextSegment === 'panorama'

  return (
    isPlacingNewLocationMarker ||
    isEditingLocationMarker ||
    isViewingLocation ||
    isViewingPanorama
  )
}

const MobileLayout = () => {
  const streetView = useSelector((state) => state.location.streetViewOpen)
  const { pathname } = useLocation()
  const { tabIndex, handleTabChange, tabContent } = Tabs()

  return (
    <PageTabs index={tabIndex} onChange={handleTabChange}>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>
      <TopBarSwitch />
      <div
        style={{
          display: shouldDisplayMapPage(pathname) ? 'block' : 'none',
          position: 'absolute',
          top: '30px',
          bottom: '0px',
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <MapPage />
      </div>
      {connectRoutes}
      <TabPanels style={{ paddingBottom: '50px' }}>
        <Switch>
          {aboutRoutes}
          {authRoutes}
          <Route path="/reviews/:reviewId/edit">
            {({ match }) => (
              <EditReviewForm stepped editingId={match.params.reviewId} />
            )}
          </Route>
          <Route path="/locations/:locationId/review">
            <ReviewForm stepped />
          </Route>
          <Route path="/locations/:locationId/edit/details">
            {({ match }) => (
              <EditLocationForm editingId={match.params.locationId} />
            )}
          </Route>
          <Route path="/locations/new">
            <LocationForm />
          </Route>
          <Route path={['/map', '/locations', '/list', '/settings']}>
            <Switch>
              <Route path="/locations/init" />
              <Route path="/locations/:locationId/edit/position" />
              <Route path="/locations/:locationId">
                {!streetView && <EntryMobile />}
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
            '/locations/:locationId/edit/details',
            '/locations/new',
          ]}
        />
        <Route>
          <TabList
            style={{
              zIndex: zIndex.mobileTablist,
              position: 'fixed',
              width: '100%',
              bottom: 0,
              height: '50px',
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
