import { Check, X } from '@styled-icons/boxicons-regular'
import { useSelector } from 'react-redux'
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
  const { review } = useSelector((state) => state.review)

  const handleGoBack = (event) => {
    event.stopPropagation()
    history.goBack()
  }

  return (
    <Switch>
      <Route path="/reviews/:reviewId/edit">
        {() => (
          <TopBarNav
            onBack={(event) => {
              event.stopPropagation()
              history.push(`/locations/${review?.location_id}`)
            }}
            title="Editing Review"
          />
        )}
      </Route>
      <Route path="/locations/:locationId/review">
        {() => <TopBarNav onBack={handleGoBack} title="Adding review" />}
      </Route>
      <Route path="/locations/:locationId/edit/details">
        {({ match }) => (
          <TopBarNav
            onBack={(event) => {
              event.stopPropagation()
              history.push(`/locations/${match.params.locationId}`)
            }}
            title="Editing location"
          />
        )}
      </Route>
      <Route
        path="/locations/:locationId/edit/position"
        component={LocationPositionNav}
      />
      <Route path="/locations/new">
        <TopBarNav
          onBack={() => history.push('/locations/init')}
          title="New location"
        />
      </Route>
      <Route path="/locations/init">
        <TopBarNav
          left={
            <Instructions>
              Choose a position for your new location.
            </Instructions>
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
                onClick={() => history.push('/locations/new')}
              />
            </>
          }
        />
      </Route>
    </Switch>
  )
}

export default LocationNav
