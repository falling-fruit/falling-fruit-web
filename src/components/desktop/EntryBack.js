import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import BackButton from '../ui/BackButton'

const StyledEntryBack = styled.div`
  padding: 25px 10px 15px;

  svg {
    height: 20px;
    margin-right: 7px;
  }
`

const EntryBack = () => {
  const { state } = useLocation()

  const onBackButtonClick = () => {
    // Default to going back to the map. This occurs when the user opens /entry/{typeId} directly
    history.push(state?.fromPage ?? '/map')
  }

  return (
    <StyledEntryBack>
      <BackButton onClick={onBackButtonClick}>
        <ArrowBack />
        Back to Results
      </BackButton>
    </StyledEntryBack>
  )
}

export default EntryBack
