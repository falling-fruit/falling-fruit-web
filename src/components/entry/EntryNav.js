import { ArrowBack } from '@styled-icons/boxicons-regular'
import { Map, Pencil } from '@styled-icons/boxicons-solid'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'

const EntryNavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 15px 10px 10px;

  @media ${({ theme }) => theme.device.mobile} {
    height: 60px;
    padding: 0;
  }
`

const Text = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.secondaryText};

  p {
    font-size: 15px;
  }

  svg {
    height: 20px;
    margin-right: 7px;

    @media ${({ theme }) => theme.device.mobile} {
      margin-left: 5px;
      height: 25px;
    }
  }
`

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 110px;
`

const ArrowBackButton = styled(ArrowBack)`
  cursor: pointer;
`

const EntryNav = ({ isDesktop }) => {
  const history = useHistory()
  const { state } = useLocation()

  const onBackButtonClick = () => {
    // Default to going back to the map. This occurs when the user opens /entry/{typeId} directly
    history.push(state?.fromPage ?? '/map')
  }

  const onEditButtonClick = () => {
    // TODO: edit entry callback
    console.log('Edit entry details clicked')
  }

  const onMapButtonClick = () => {
    // TODO: view entry on map callback
    console.log('View entry on map clicked')
  }

  const onEnter = (event, callback) => {
    if (event.key === 'Enter') {
      callback()
    }
  }

  return (
    <EntryNavContainer>
      <Text>
        <ArrowBackButton
          role="button"
          tabIndex={0}
          aria-pressed="false"
          onKeyDown={(e) => onEnter(e, onBackButtonClick)}
          onClick={onBackButtonClick}
          color={theme.secondaryText}
        />
        {isDesktop && <p>Back to Results</p>}
      </Text>
      {!isDesktop && (
        <Icons>
          <IconButton
            size={50}
            icon={<Pencil color={theme.secondaryText} />}
            onClick={onEditButtonClick}
            label="edit-entry-details"
          />
          <IconButton
            size={50}
            icon={<Map color={theme.secondaryText} />}
            onClick={onMapButtonClick}
            label="map-entry-details"
          />
        </Icons>
      )}
    </EntryNavContainer>
  )
}

export default EntryNav
