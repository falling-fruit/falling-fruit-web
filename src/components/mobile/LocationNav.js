import { Check, X } from '@styled-icons/boxicons-regular'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'
import LocationPositionNav from './LocationPositionNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const LocationNav = () => {
  const history = useAppHistory()

  const handleGoBack = (event) => {
    event.stopPropagation()
    history.goBack()
  }

  return (
    <Switch>
      <Route path="/reviews/:reviewId/edit">
        {() => <TopBarNav onBack={handleGoBack} title="Editing Review" />}
      </Route>
      <Route path="/locations/:locationId/review">
        {() => <TopBarNav onBack={handleGoBack} title="Adding review" />}
      </Route>
      <Route path="/locations/:locationId/edit/details">
        {({ match }) => (
          <TopBarNav
            onBack={() => {
              event.stopPropagation()
              return history.push(`/locations/${match.params.locationId}`)
            }}
            title="Editing location"
          />
        )}
      </Route>
      <Route
        path="/locations/:locationId/edit/position"
        component={LocationPositionNav}
      />
      <Route path="/locations/new/details">
        <TopBarNav
          onBack={() => history.push('/locations/new')}
          title="New location"
        />
      </Route>
      <Route path="/locations/new">
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
                onClick={() => history.push('/map')}
              />
              <IconButton
                label="Confirm choose location"
                icon={<Check />}
                raised
                size={54}
                color={theme.green}
                onClick={() => history.push('/locations/new/details')}
              />
            </>
          }
        />
      </Route>
    </Switch>
  )
}

export default LocationNav
