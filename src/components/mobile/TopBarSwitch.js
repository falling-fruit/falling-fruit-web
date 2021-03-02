import { Route, Switch } from 'react-router-dom'

import Search from '../search/Search'
import TopBar from '../ui/TopBar'
import EntryBar from './EntryBar'

const TopBarSwitch = () => (
  <Switch>
    <TopBar>
      <Route path="/map">
        <Search />
      </Route>
      <Route path="/list">
        <EntryBar />
      </Route>
    </TopBar>
    <Route></Route>
  </Switch>
)

export default TopBarSwitch
