import { Route, Switch } from 'react-router-dom'

import EntryDetails from './EntryDetailsWrapper'
import SidePaneSwitch from './SidePaneSwitch'

const SidePane = () => (
  <div>
    <SidePaneSwitch />
    <Switch>
      <Route path="/entry/:id">
        <EntryDetails />
      </Route>
      <Route>Side Pane Details</Route>
    </Switch>
  </div>
)

export default SidePane
