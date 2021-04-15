import { Route, Switch } from 'react-router-dom'

import EntryNav from '../entry/EntryNav'
import LocationNav from '../form/LocationNav'
import SearchWrapper from '../SearchWrapper'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => (
  <Switch>
    <Route path="/settings"></Route>
    <Route path="/entry/new">
      <TopBar>
        <LocationNav />
      </TopBar>
    </Route>
    <Route path="/entry/:id">
      <TopBar rectangular>
        <EntryNav />
      </TopBar>
    </Route>
    <Route>
      <TopBar>
        <Switch>
          <Route path="/map">
            <SearchWrapper />
          </Route>
          <Route path="/list">
            <SearchWrapper />
          </Route>
        </Switch>
      </TopBar>
    </Route>
  </Switch>
)

export default TopBarSwitch
