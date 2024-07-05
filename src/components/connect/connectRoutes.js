import { Route } from 'react-router-dom'

import ConnectLocation from './ConnectLocation'
import ConnectReview from './ConnectReview'
import ConnectView from './ConnectView'
import DisconnectLocation from './DisconnectLocation'

const connectRoutes = [
  <Route
    key="connect-view"
    path={['/map', '/list', '/settings', '/locations/new']}
  >
    <ConnectView />
  </Route>,
  <Route
    key="connect-location"
    path={['/locations/:locationId/:nextSegment', '/locations/:locationId']}
  >
    {({ match }) =>
      match && (
        <ConnectLocation
          locationId={match.params.locationId}
          isBeingEdited={match.params.nextSegment === 'edit'}
        />
      )
    }
  </Route>,
  <Route key="connect-review" path="/reviews/:reviewId/edit">
    {({ match }) => match && <ConnectReview reviewId={match.params.reviewId} />}
  </Route>,
  <Route key="disconnect-location" path={['/map', '/list']}>
    {({ match }) => match && <DisconnectLocation />}
  </Route>,
]

export default connectRoutes
