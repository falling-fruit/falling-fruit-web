import { Route, Switch } from 'react-router-dom'

import EntryWrapper from '../entry/EntryWrapper'
import { EditLocation, EditReview } from '../form/EditableForm'
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
            <EditLocation />
          </Route>
          <Route path="/review/:id/edit">
            <EditReview />
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
        </Switch>
      </NavPane>
    </Route>
  </Switch>
)

export default SidePaneSwitch
