import { Route, Switch } from 'react-router-dom'

import EntryNav from '../entry/EntryNav'
import Search from '../search/Search'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => (
  <Switch>
    <Route path="/settings"></Route>
    <Route>
      <TopBar>
        <Switch>
          <Route path="/map">
            <Search />
          </Route>
          <Route path="/list">
            <Search />
          </Route>
          <Route path="/entry">
            <EntryNav />
          </Route>
        </Switch>
      </TopBar>
    </Route>
  </Switch>
)

export default TopBarSwitch
