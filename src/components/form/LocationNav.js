import { Check, X } from '@styled-icons/boxicons-regular'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const xAndCheckIcons = (history, xLabel, xUrl, checkLabel, checkUrl) => (
  <>
    <IconButton
      label={xLabel}
      icon={<X />}
      raised
      size={54}
      onClick={() => history.push(xUrl)}
    />
    <IconButton
      label={checkLabel}
      icon={<Check />}
      raised
      size={54}
      color={theme.green}
      onClick={() => history.push(checkUrl)}
    />
  </>
)
const LocationNav = () => {
  const history = useAppHistory()

  return (
    <Switch>
      <Route path="/reviews/:reviewId/edit">
        {() => (
          <TopBarNav
            onBack={(event) => {
              event.stopPropagation()
              return history.goBack()
            }}
            title="Editing Review"
          />
        )}
      </Route>
      <Route path="/locations/:locationId/review">
        {() => (
          <TopBarNav
            onBack={(event) => {
              event.stopPropagation()
              return history.goBack()
            }}
            title="Adding review"
          />
        )}
      </Route>
      <Route path="/locations/:locationId/edit/details">
        {() => (
          <TopBarNav
            onBack={(event) => {
              event.stopPropagation()
              return history.goBack()
            }}
            title="Editing location"
          />
        )}
      </Route>
      <Route path="/locations/:locationId/edit">
        {({ match }) => (
          <TopBarNav
            left={
              <Instructions>Adjust location for the edited entry.</Instructions>
            }
            rightIcons={xAndCheckIcons(
              history,
              'Cancel adjust location',
              '/map',
              'Confirm adjust location',
              `/locations/${match.params.locationId}/edit/details`,
            )}
          />
        )}
      </Route>
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
          rightIcons={xAndCheckIcons(
            history,
            'Cancel choose location',
            '/map',
            'Confirm choose location',
            '/locations/new/details',
          )}
        />
      </Route>
    </Switch>
  )
}

export default LocationNav
