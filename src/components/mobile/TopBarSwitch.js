import { Route, Switch } from 'react-router-dom'

import Search from '../search/Search'
import TopBar from '../ui/TopBar'
import EntryBar from './EntryBar'

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
            <EntryBar />
          </Route>
        </Switch>
      </TopBar>
    </Route>
  </Switch>
)

export default TopBarSwitch
