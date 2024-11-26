import { Route } from 'react-router-dom'

import ConnectInitLocation from './ConnectInitLocation'
import ConnectList from './ConnectList'
import ConnectLocation from './ConnectLocation'
import ConnectMap from './ConnectMap'
import ConnectNewLocation from './ConnectNewLocation'
import ConnectOverscroll from './ConnectOverscroll'
import ConnectPath from './ConnectPath'
import ConnectReview from './ConnectReview'
import ConnectTypes from './ConnectTypes'
import DisconnectInitLocation from './DisconnectInitLocation'
import DisconnectLocation from './DisconnectLocation'
import DisconnectReview from './DisconnectReview'

const connectRoutes = [
  /*
   * ConnectList
   * why: the list page needs a map in Redux
   *
   * action: if showing the list before /map was loaded,
   * briefly visit /map and go back to /list
   */
  <Route key="connect-list" path={['/map', '/list']}>
    {({ match }) =>
      match && <ConnectList isListRoute={match.path.startsWith('/list')} />
    }
  </Route>,

  /*
   * ConnectMap
   * why:
   * - the map needs an initial view in Redux to do a first render
   * - if something else changed the URL, the map needs to get back in sync
   *
   * action:
   * - get the view from URL or default to our chosen location centred on U of Illinois
   * - if this is the first render, dispatch a Redux update
   */
  <Route key="connect-view" path={['/map', '/settings', '/locations/init']}>
    <ConnectMap />
  </Route>,
  /*
   * ConnectPath
   * why:
   * - if something else changed the URL, e.g. the back button, the map needs to get back in sync
   *
   * action:
   * - if the map is present but not in sync with the URL, navigate to the URL's view
   */
  <Route
    key="connect-path"
    path={['/map', '/settings', '/locations', '/reviews']}
  >
    <ConnectPath />
  </Route>,
  /*
   * ConnectNewLocation
   * why: map marker for editing location position and location form need initial position info
   *
   * actions:
   * - use center of URL view to initialise position of new location
   * - if needed, set initial view corresponding to URL view
   */
  <Route key="connect-new-location" path="/locations/new">
    <ConnectNewLocation />
  </Route>,
  /*
   * ConnectInitLocation
   * why:
   * - mobile only URL
   * - map needs to know we're in this state rather than generic map state
   *
   *
   * actions:
   * - if on desktop because of screen resize, go to /locations/new
   * - set a flag in redux
   */
  <Route key="connect-init-location" path={['/locations/init', '/settings']}>
    <ConnectInitLocation />
  </Route>,
  /*
   * ConnectLocation
   * why:
   * - map marker for editing location position and location form need position info
   * - keep track of starting to edit a location
   * - keep track of whether user wants street view
   * - on mobile, we need to center the map on the edited location because the UX involves panning the map on central pin
   * - on mobile, we need to disable the drawer when arriving from list view
   * - on mobile, the drawer needs the user scrolling up and down
   * - on desktop, clicking location from a settings page should make 'back' go to settings instead if map
   *
   * actions:
   * - fetch data from backend
   * - if needed, set initial view to location as centre
   * - sync property of being edited from URL routes to Redux
   * - sync property of being viewed in street view from URL routes to Redux
   * - on mobile, center and zoom on edited location
   * - on mobile, keep track of whether we arrived via list-locations URL
   * - on mobile, disable default overscroll (e.g. a refresh on scroll down in Chrome)
   * - on desktop, reset the fromSettings flag when leaving location
   */
  <Route
    key="connect-location"
    path={[
      '/locations/:locationId/:nextSegment/:nextNextSegment',
      '/locations/:locationId/:nextSegment',
      '/locations/:locationId',
      '/list-locations/:locationId',
    ]}
  >
    {({ match }) =>
      match &&
      match.params.locationId !== 'new' &&
      match.params.locationId !== 'init' && (
        <ConnectLocation
          locationId={match.params.locationId}
          isBeingEdited={match.params.nextSegment === 'edit'}
          isBeingEditedPosition={match.params.nextNextSegment === 'position'}
          isStreetView={match.params.nextSegment === 'panorama'}
          isFromListLocations={match.path.startsWith('/list-locations/')}
        />
      )
    }
  </Route>,
  /*
   * ConnectReview
   * why: edit review form needs backend info
   *
   * actions:
   * - fetch data from backend
   * - if needed, set initial view to reviewed location as centre
   */
  <Route key="connect-review" path="/reviews/:reviewId/edit">
    {({ match }) => match && <ConnectReview reviewId={match.params.reviewId} />}
  </Route>,
  /*
   * ConnectTypes
   * why: app needs reference of known types in the database
   *
   * actions:
   * - fetch data from backend
   * - simplify to keep just the currently selected language
   */
  <Route
    key="connect-types"
    path={['/map', '/list', '/locations', '/reviews', '/settings', '/changes']}
  >
    <ConnectTypes />
  </Route>,
  /*
   * DisconnectLocation
   * why: the location marker needs to go away if user stopped adding or editing location
   *
   * action: clear location in Redux
   */
  <Route key="disconnect-location" path={['/map', '/locations/init']}>
    {({ match }) => match && <DisconnectLocation />}
  </Route>,
  /*
   * ConnectOverscroll
   * why: when we ask the user to pan on mobile or scroll a lot, sometimes they accidentally overscroll
   *
   * action: set a style property disabling the default 'refresh page on vertical overscroll' for list, location drawer, and pages with map on it
   */
  <Route
    key="connect-overscroll"
    path={[
      '/locations/:locationId/:nextSegment/:nextNextSegment',
      '/locations/:locationId/:nextSegment',
      '/locations/:locationId',
      '/list-locations/:locationId',
      '/map',
      '/list',
    ]}
  >
    {({ match }) =>
      match &&
      (!match.params.nextNextSegment ||
        match.params.nextSegment === 'panorama' ||
        match.params.nextNextSegment === 'position') && <ConnectOverscroll />
    }
  </Route>,

  /*
   * DisconnectReview
   * why: if we start editing the review and then go back to location or to the map, and then open settings, the back button should not take us to the abandoned review
   *
   * action: clear review in Redux
   */
  <Route key="disconnect-review" path={['/map', '/locations']}>
    {({ match }) => match && <DisconnectReview />}
  </Route>,

  /*
   * DisconnectInitLocation
   * why: need to clear the mobile initialization state when navigating to main views
   *
   * action: clear isBeingInitializedMobile in Redux when on /map or /list
   */
  <Route key="disconnect-init-location" path={['/map', '/list']}>
    <DisconnectInitLocation />
  </Route>,
]

export default connectRoutes
