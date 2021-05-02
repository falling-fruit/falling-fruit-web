import { Route, Switch } from 'react-router-dom'

import EntryOverview from '../entry/EntryOverview'
import EntryReviews from '../entry/EntryReviews'
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
          <Route path="/entry/new">
            <LocationForm desktop />
          </Route>
          <Route exact path="/settings">
            <SettingsPage desktop />
          </Route>
          <Route exact path="/entry/:id">
            <div>
              <EntryOverview />
              <EntryReviews />
            </div>
          </Route>
        </Switch>
      </NavPane>
    </Route>
  </Switch>
)

export default SidePaneSwitch
