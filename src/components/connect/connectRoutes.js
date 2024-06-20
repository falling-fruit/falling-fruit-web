import { Route } from 'react-router-dom'

import ConnectLocation from './ConnectLocation'
import ConnectReview from './ConnectReview'
import DisconnectLocation from './DisconnectLocation'

const connectRoutes = [
  <Route key="connect-location" path="/locations/:locationId">
    {({ match }) =>
      match && <ConnectLocation locationId={match.params.locationId} />
    }
  </Route>,
  <Route key="connect-review" path="/reviews/:reviewId/edit">
    {({ match }) => match && <ConnectReview reviewId={match.params.reviewId} />}
  </Route>,
  <Route key="disconnect-location" path={["/map", "/list"]}>
    {({ match }) => match && <DisconnectLocation />}
  </Route>,
]

export default connectRoutes
