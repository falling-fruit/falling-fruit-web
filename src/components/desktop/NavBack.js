import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getPathWithMapState } from '../../utils/getInitialUrl'
import BackButton from '../ui/BackButton'

const StyledNavBack = styled.div`
  padding: 25px 0 15px;

  ${({ isEntry }) => !isEntry && 'padding-left: 10px;'}

  svg {
    height: 20px;
    margin-right: 7px;
  }
`

// TODO: redefine NavBack to accept a callback and label instead of isEntry
const NavBack = ({ isEntry }) => {
  const history = useHistory()
  const { state } = useLocation()
  const { t } = useTranslation()

  const handleBackButtonClick = () => {
    // Default to going back to the map. This occurs when the user opens /entry/{typeId} directly
    history.push(getPathWithMapState(state?.fromPage ?? '/map'))
  }

  return (
    <StyledNavBack isEntry={isEntry}>
      <BackButton onClick={handleBackButtonClick}>
        <ArrowBack />
        {isEntry ? t('Back') : t('Back to Results')}
      </BackButton>
    </StyledNavBack>
  )
}

export default NavBack
