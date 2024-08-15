import { Route } from 'react-router-dom'

import ConnectList from './ConnectList'
import ConnectLocation from './ConnectLocation'
import ConnectMap from './ConnectMap'
import ConnectNewLocation from './ConnectNewLocation'
import ConnectPath from './ConnectPath'
import ConnectReview from './ConnectReview'
import ConnectTypes from './ConnectTypes'
import DisconnectLocation from './DisconnectLocation'

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
  <Route key="connect-view" path={['/map', '/settings']}>
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
   * ConnectLocation
   * why:
   * - map marker for editing location position and location form need position info
   * - keep track of starting to edit a location
   * - keep track of whether user wants street view
   * - on mobile, we need to center the map on the edited location because the UX involves panning the map on central pin
   *
   * actions:
   * - fetch data from backend
   * - if needed, set initial view to location as centre
   * - sync property of being edited from URL routes to Redux
   * - sync property of being viewed in street view from URL routes to Redux
   * - on mobile, center and zoom on edited location
   */
  <Route
    key="connect-location"
    path={[
      '/locations/:locationId/:nextSegment/:nextNextSegment',
      '/locations/:locationId/:nextSegment',
      '/locations/:locationId',
    ]}
  >
    {({ match }) =>
      match &&
      match.params.locationId !== 'new' && (
        <ConnectLocation
          locationId={match.params.locationId}
          isBeingEdited={match.params.nextSegment === 'edit'}
          isBeingEditedPosition={match.params.nextNextSegment === 'position'}
          isStreetView={match.params.nextSegment === 'panorama'}
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
  <Route key="connect-types" path={['/map', '/list', '/locations', '/reviews']}>
    <ConnectTypes />
  </Route>,
  /*
   * DisconnectLocation
   * why: the location marker needs to go away if user stopped adding or editing location
   *
   * action: clear location in Redux
   */
  <Route key="disconnect-location" path={['/map']}>
    {({ match }) => match && <DisconnectLocation />}
  </Route>,
]

export default connectRoutes
