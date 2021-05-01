import { Route, Switch } from 'react-router-dom'

import EntryPane from './EntryPane'
import MainPane from './MainPane'
import SettingsPane from './SettingsPane'

const SidePaneSwitch = () => (
  <Switch>
    <Route exact path="/settings">
      <SettingsPane />
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
