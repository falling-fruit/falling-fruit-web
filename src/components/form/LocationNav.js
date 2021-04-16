import { Check, X } from '@styled-icons/boxicons-regular'
import { useContext, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'
import styled from 'styled-components'

import MapContext from '../map/MapContext'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const LocationNav = () => {
  const history = useHistory()
  const {
    view: { center },
  } = useContext(MapContext)
  const [isConfirming, setIsConfirming] = useState(false)

  useUpdateEffect(() => {
    setIsConfirming(true)
  }, [center.lat, center.lng])

  return (
    <Switch>
      <Route path="/entry/new">
        <TopBarNav
          left={
            <Instructions>
              {isConfirming
                ? 'Confirm Location'
                : 'Choose a location for your new entry.'}
            </Instructions>
          }
          rightIcons={
            <>
              <IconButton
                label="Cancel choose location"
                icon={<X />}
                raised
                size={54}
                onClick={() => {
                  if (isConfirming) {
                    setIsConfirming(false)
                  } else {
                    history.push('/map')
                  }
                }}
              />
              {isConfirming && (
                <IconButton
                  label="Confirm choose location"
                  icon={<Check />}
                  raised
                  size={54}
                  color={theme.green}
                  onClick={() => history.push('/entry/new/details')}
                />
              )}
            </>
          }
        />
      </Route>
      <Route>
        <TopBarNav
          onBack={() => history.push('/entry/new')}
          title="New Location"
        />
      </Route>
    </Switch>
  )
}

export default LocationNav
