import { Route } from 'react-router-dom'

import ConnectLocation from './ConnectLocation'
import ConnectMap from './ConnectMap'
import ConnectNewLocation from './ConnectNewLocation'
import ConnectReview from './ConnectReview'
import ConnectView from './ConnectView'
import DisconnectLocation from './DisconnectLocation'

// TODO: document what these effects are for
const connectRoutes = [
  <Route key="connect-map" path={['/map', '/list']}>
    {({ match }) =>
      match && <ConnectMap isListView={match.path.startsWith('/list')} />
    }
  </Route>,
  <Route key="connect-view" path={['/map', '/list', '/settings']}>
    <ConnectView />
  </Route>,
  <Route key="connect-new-location" path="/locations/new">
    <ConnectNewLocation />
  </Route>,
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
  <Route key="connect-review" path="/reviews/:reviewId/edit">
    {({ match }) => match && <ConnectReview reviewId={match.params.reviewId} />}
  </Route>,
  <Route key="disconnect-location" path={['/map']}>
    {({ match }) => match && <DisconnectLocation />}
  </Route>,
]

export default connectRoutes
