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
          '/account',
          '/about',
          '/signup',
          '/login',
          '/password',
          '/confirmation',
        ]}
      ></Route>
      <Route path="/entry/new">
        <TopBar>
          <LocationNav />
        </TopBar>
      </Route>
      {isFromList && <Route path="/entry/:id" />}
      <Route>
        <TopBar>
          <Search />
        </TopBar>
      </Route>
    </Switch>
  )
}

export default TopBarSwitch
