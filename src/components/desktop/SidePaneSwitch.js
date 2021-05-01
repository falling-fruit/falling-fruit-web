import { Route, Switch } from 'react-router-dom'

import SettingsPage from '../settings/SettingsPage'
import EntryPane from './EntryPane'
import MainPane from './MainPane'

const SidePaneSwitch = () => (
  <Switch>
    <Route exact path="/settings">
      <SettingsPage />
    </Route>
    <Route exact path="/entry/:id">
      <EntryPane />
    </Route>
    <Route exact path="/map">
      <MainPane />
    </Route>
    <Route exact path="/list">
      <MainPane />
    </Route>
    <Route exact path="/">
      <MainPane />
    </Route>
  </Switch>
)

export default SidePaneSwitch
