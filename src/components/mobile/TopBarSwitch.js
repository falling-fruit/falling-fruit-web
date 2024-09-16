import { Route, Switch } from 'react-router-dom'

import Search from '../search/Search'
import TopBar from '../ui/TopBar'
import FilterWrapper from './FilterWrapper'
import LocationNav from './LocationNav'

const TopBarSwitch = () => (
  <Switch>
    <Route
      path={[
        '/reviews/:reviewId/edit',
        '/locations/:locationId/review',
        '/locations/:locationId/edit',
        '/locations/new',
      ]}
    >
      <TopBar>
        <LocationNav />
      </TopBar>
    </Route>
    <Route path={['/map', '/list', '/locations/:locationId']}>
      <TopBar>
        <Search />
        <FilterWrapper />
      </TopBar>
    </Route>
  </Switch>
)

export default TopBarSwitch
