import { Route, Switch, useLocation } from 'react-router-dom'

import LocationNav from '../form/LocationNav'
import Search from '../search/Search'
import TopBar from '../ui/TopBar'

const TopBarSwitch = () => {
  const { state } = useLocation()
  const isFromList = state?.fromPage === '/list'

  return (
    <Switch>
      <Route
        path={[
          '/settings',
          '/users/edit',
          '/about',
          '/users/sign_up',
          '/users/sign_in',
          '/users/password',
          '/users/confirmation',
        ]}
      ></Route>
      <Route
        path={[
          '/locations/:locationId/edit-review/:reviewId',
          '/locations/:locationId/review',
          '/locations/:locationId/edit',
          '/locations/new',
        ]}
      >
        <TopBar>
          <LocationNav />
        </TopBar>
      </Route>
      {isFromList && <Route path="/locations/:locationId" />}
      <Route>
        <TopBar>
          <Search />
        </TopBar>
      </Route>
    </Switch>
  )
}

export default TopBarSwitch
