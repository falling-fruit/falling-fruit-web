import { Route, Switch } from 'react-router-dom'

import EntryNav from '../entry/EntryNav'
import LocationNav from '../form/LocationNav'
import Search from '../search/Search'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => (
  <Switch>
    <Route path="/settings"></Route>
    <Route path="/map/entry/new">
      <TopBar>
        <LocationNav />
      </TopBar>
    </Route>
    <Route path="/list/entry/:id">
      <TopBar rectangular>
        <EntryNav />
      </TopBar>
    </Route>
    <Route>
      <TopBar>
        <Search />
      </TopBar>
    </Route>
  </Switch>
)

export default TopBarSwitch
