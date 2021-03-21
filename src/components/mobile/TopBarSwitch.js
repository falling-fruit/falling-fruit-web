import { Route, Switch } from 'react-router-dom'

import EntryNav from '../entry/EntryNav'
import SearchWrapper from '../SearchWrapper'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => (
  <Switch>
    <Route path="/settings"></Route>
    <Route path="/entry">
      <TopBar>
        <EntryNav />
      </TopBar>
    </Route>
    <Route>
      <TopBar rounded>
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
