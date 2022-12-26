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
          <Route path="/entry/:id/edit">
            <EditLocationPage />
          </Route>
          <Route path="/review/:id/edit">
            <EditReviewPage />
          </Route>
          <Route path="/entry/new">
            <LocationForm />
          </Route>
          <Route path="/settings">
            <SettingsPage desktop />
          </Route>
          <Route path={['/entry/:id', '/entry/:id']}>
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
