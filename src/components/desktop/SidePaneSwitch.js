import { Redirect, Route, Switch } from 'react-router-dom'

import EntryWrapper from '../entry/EntryWrapper'
import { EditLocationPage, EditReviewPage } from '../form/EditableForm'
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
          <Route path="/locations/:id/edit">
            <EditLocationPage />
          </Route>
          <Route path="/reviews/:id/edit">
            <EditReviewPage />
          </Route>
          <Route path="/locations/new">
            <LocationForm />
          </Route>
          <Route path="/settings">
            <SettingsPage desktop />
          </Route>
          <Route path={['/locations/:id', '/locations/:id']}>
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
