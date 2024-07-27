import { Route } from 'react-router-dom'

import ConnectList from './ConnectList'
import ConnectLocation from './ConnectLocation'
import ConnectMap from './ConnectMap'
import ConnectNewLocation from './ConnectNewLocation'
import ConnectReview from './ConnectReview'
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
   * why: the map needs an initial view in Redux to do a first render
   *
   * action: get the view from URL or set a default
   * then dispatch an update
   */
  <Route key="connect-view" path={['/map']}>
    <ConnectMap />
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
          isBeingEditedDetails={match.params.nextNextSegment === 'details'}
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
