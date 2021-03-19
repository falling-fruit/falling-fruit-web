import { ArrowBack } from '@styled-icons/boxicons-regular'
import { Map, Pencil } from '@styled-icons/boxicons-solid'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'

const EntryNavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`

const EntryNavTextContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    height: 25px;
    margin-right: 10px;
  }
`

const EntryNavIconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 110px;
`

const ArrowBackButton = styled(ArrowBack)`
  cursor: pointer;
`

const EntryNav = ({ isDesktop }) => {
  const history = useHistory()

  const onBackButtonClick = () => history.goBack()

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
      <EntryNavTextContainer>
        <ArrowBackButton
          role="button"
          tabIndex={0}
          aria-pressed="false"
          onKeyDown={(e) => onEnter(e, onBackButtonClick)}
          onClick={onBackButtonClick}
          color={theme.secondaryText}
        />
        <p>{isDesktop ? 'Back to Results' : 'Results'}</p>
      </EntryNavTextContainer>
      {!isDesktop && (
        <EntryNavIconsContainer>
          <IconButton
            size={50}
            raised={false}
            icon={<Pencil color={theme.secondaryText} />}
            onClick={onEditButtonClick}
            label={'edit-entry-details'}
          />
          <IconButton
            size={50}
            raised={false}
            icon={<Map color={theme.secondaryText} />}
            onClick={onMapButtonClick}
            label={'map-entry-details'}
          />
        </EntryNavIconsContainer>
      )}
    </EntryNavContainer>
  )
}

export default EntryNav
