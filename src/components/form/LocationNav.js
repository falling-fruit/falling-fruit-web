import { Check, X } from '@styled-icons/boxicons-regular'
import { Route, Switch, useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getPathWithMapState } from '../../utils/getInitialUrl'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const LocationNav = () => {
  const history = useHistory()

  return (
    <Switch>
      <Route path="/map/entry/new/details">
        <TopBarNav
          onBack={() => history.push(getPathWithMapState('/map/entry/new'))}
          title="New Location"
        />
      </Route>
      <Route>
        <TopBarNav
          left={
            <Instructions>Choose a location for your new entry.</Instructions>
          }
          rightIcons={
            <>
              <IconButton
                label="Cancel choose location"
                icon={<X />}
                raised
                size={54}
                onClick={() => {
                  history.push(getPathWithMapState('/map'))
                }}
              />
              <IconButton
                label="Confirm choose location"
                icon={<Check />}
                raised
                size={54}
                color={theme.green}
                onClick={() => {
                  history.push(getPathWithMapState('/map/entry/new/details'))
                }}
              />
            </>
          }
        />
      </Route>
    </Switch>
  )
}

export default LocationNav
