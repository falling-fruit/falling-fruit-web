import { ArrowBack } from '@styled-icons/boxicons-regular'
import { Map, Pencil } from '@styled-icons/boxicons-solid'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'

const StyledEntryNav = styled.div`
  padding: 25px 10px 15px;

  @media ${({ theme }) => theme.device.mobile} {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 55px;
    padding: 0;
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 15px;
  font-weight: bold;

  /* Reset button styles */
  cursor: pointer;
  font-family: inherit;
  border: 0;
  padding: 0;
  background: none;

  @media ${({ theme }) => theme.device.mobile} {
    /* Make the touch target bigger */
    width: 75px;
    height: 100%;
  }

  svg {
    height: 20px;
    margin-right: 7px;

    @media ${({ theme }) => theme.device.mobile} {
      height: 25px;
      padding-left: 5px;
    }
  }
`

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 110px;
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

  return (
    <StyledEntryNav>
      <BackButton onClick={onBackButtonClick} tabindex={0}>
        <ArrowBack />
        {isDesktop && 'Back to Results'}
      </BackButton>
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
    </StyledEntryNav>
  )
}

export default EntryNav
