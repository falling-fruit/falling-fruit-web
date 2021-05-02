import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import BackButton from '../ui/BackButton'

const StyledNavBack = styled.div`
  padding: 25px 10px 15px;

  svg {
    height: 20px;
    margin-right: 7px;
  }
`

const NavBack = () => {
  const history = useHistory()
  const { state } = useLocation()
  const { t } = useTranslation()

  const handleBackButtonClick = () => {
    // Default to going back to the map. This occurs when the user opens /entry/{typeId} directly
    history.push(state?.fromPage ?? '/map')
  }

  return (
    <StyledNavBack>
      <BackButton onClick={handleBackButtonClick}>
        <ArrowBack />
        {t('Back to Results')}
      </BackButton>
    </StyledNavBack>
  )
}

export default NavBack
