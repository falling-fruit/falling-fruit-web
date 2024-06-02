import { Redirect, Route, Switch } from 'react-router-dom'

import EntryWrapper from '../entry/EntryWrapper'
import { EditLocationPage } from '../form/EditLocation'
import { EditReviewPage } from '../form/EditReview'
import { LocationForm } from '../form/LocationForm'
import SettingsPage from '../settings/SettingsPage'
import MainPane from './MainPane'
import { NavPane } from './NavPane'

const SidePaneSwitch = () => (
  <Switch>
    <Route exact path={['/map', '/list', '/', '/map/:geocoord']}>
      <MainPane />
    </Route>
    <Route>
      <NavPane>
        <Switch>
          <Route path="/locations/:locationId/edit">
            <EditLocationPage />
          </Route>
          <Route path="/locations/:locationId/edit-review/:reviewId">
            <EditReviewPage />
          </Route>
          <Route path="/locations/new">
            <LocationForm />
          </Route>
          <Route path="/settings">
            <SettingsPage desktop />
          </Route>
          <Route path="/locations/:locationId">
            <EntryWrapper desktop />
          </Route>
          <Route>
            <Redirect to="/map" />
          </Route>
        </Switch>
      </NavPane>
    </Route>
  </Switch>
)

export default SidePaneSwitch
