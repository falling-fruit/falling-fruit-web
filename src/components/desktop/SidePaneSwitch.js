import { Route, Switch } from 'react-router-dom'

import EntryPane from './EntryPane'
import MainPane from './MainPane'

const SidePaneSwitch = () => (
  <Switch>
    <Route path="/entry/:id">
      <EntryPane />
    </Route>
    <Route>
      <MainPane />
    </Route>
  </Switch>
)

export default SidePaneSwitch
