import { Route, Switch } from 'react-router-dom'

import Search from '../search/Search'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => (
  <Switch>
    <Route path="/map">
      <TopBar>
        <Search />
      </TopBar>
    </Route>
    <Route path="/list">
      <TopBar>
        <Search />
      </TopBar>
    </Route>
    <Route></Route>
  </Switch>
)

export default TopBarSwitch
