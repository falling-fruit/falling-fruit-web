import { Route } from 'react-router-dom'

import ConnectLocation from './ConnectLocation'
import ConnectReview from './ConnectReview'

const connectRoutes = [
  <Route key="connect-location" path="/locations/:locationId">
    {({ match }) =>
      match && <ConnectLocation locationId={match.params.locationId} />
    }
  </Route>,
  <Route key="connect-review" path="/reviews/:reviewId/edit">
    {({ match }) => match && <ConnectReview reviewId={match.params.reviewId} />}
  </Route>,
]

export default connectRoutes
