import { Route, Switch } from 'react-router-dom'

import EntryNav from '../entry/EntryNav'
import LocationNav from '../form/LocationNav'
import SearchWrapper from '../SearchWrapper'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => (
  <Switch>
    <Route path="/settings"></Route>
    <Route path={['/map/entry/new', '/list/entry/new']}>
      <TopBar>
        <LocationNav />
      </TopBar>
    </Route>
    <Route path={['/list/entry/:id']}>
      <TopBar rectangular>
        <EntryNav />
      </TopBar>
    </Route>
    <Route>
      <TopBar>
        <SearchWrapper />
      </TopBar>
    </Route>
  </Switch>
)

export default TopBarSwitch
