import { Route, Switch } from 'react-router-dom'

import Entry from '../entry/Entry'
import { LocationForm } from '../form/LocationForm'
import SettingsPage from '../settings/SettingsPage'
import MainPane from './MainPane'
import { NavPane } from './NavPane'

const SidePaneSwitch = () => (
  <Switch>
    <Route exact path={['/map', '/list', '/']}>
      <MainPane />
    </Route>
    <Route>
      <NavPane>
        <Switch>
          <Route path="/map/entry/new">
            <LocationForm desktop />
          </Route>
          <Route path="/settings">
            <SettingsPage desktop />
          </Route>
          <Route exact path={['/map/entry/:id', '/list/entry/:id']}>
            <Entry />
          </Route>
        </Switch>
      </NavPane>
    </Route>
  </Switch>
)

export default SidePaneSwitch
