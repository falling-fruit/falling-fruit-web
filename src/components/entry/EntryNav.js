import { ArrowBack } from '@styled-icons/boxicons-regular'
import { Pencil } from '@styled-icons/boxicons-solid'
import { MapMarkerAlt as Map } from '@styled-icons/fa-solid'
import styled from 'styled-components'

import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'

const EntryNavContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const EntryNavTextContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const EntryNavText = styled.p`
  margin-left: 10px;
`

const EntryNavIconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 110px;
`

const EntryNav = () => {
  const onEditEntryDetailsButtonClick = () => {
    // TODO: edit entry callback
    console.log('Edit entry details clicked')
  }

  const onViewEntryOnMapButtonClick = () => {
    // TODO: view entry on map callback
    console.log('View entry on map clicked')
  }

  return (
    <EntryNavContainer>
      <EntryNavTextContainer>
        <ArrowBack size="20" color={theme.secondaryText} />
        <EntryNavText>Results</EntryNavText>
      </EntryNavTextContainer>
      <EntryNavIconsContainer>
        <IconButton
          size={50}
          raised={false}
          icon={<Pencil size="20" color={theme.secondaryText} />}
          onClick={onEditEntryDetailsButtonClick}
          label={'edit-entry-details'}
        />
        <IconButton
          size={50}
          raised={false}
          icon={<Map size="20" color={theme.secondaryText} />}
          onClick={onViewEntryOnMapButtonClick}
          label={'map-entry-details'}
        />
      </EntryNavIconsContainer>
    </EntryNavContainer>
  )
}

export default EntryNav
