import ReactGA from 'react-ga4'
import { withRouter } from 'react-router-dom'

const RouteTracker = ({ history }) => {
  history.listen((location) => {
    ReactGA.set({ page: location.pathname })
    ReactGA.send({ hitType: 'pageview', path: location.pathname })
  })
  return <div></div>
}

export default withRouter(RouteTracker)
