import { Route, Switch } from 'react-router-dom'

import EntryNav from '../entry/EntryNav'
import Search from '../search/Search'

const SidePaneSwitch = () => (
  <Switch>
    <Route path="/settings"></Route>
    <Route>
      <Switch>
        <Route path="/map">
          <Search />
        </Route>
        <Route path="/list">
          <Search />
        </Route>
        <Route path="/entry">
          <EntryNav isDesktop />
        </Route>
      </Switch>
    </Route>
  </Switch>
)

export default SidePaneSwitch
