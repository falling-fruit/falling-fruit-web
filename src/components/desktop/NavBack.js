import { ArrowBack, Pencil } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import BackButton from '../ui/BackButton'

const StyledNavBack = styled.div`
  padding: 25px 15px 15px 10px;

  ${({ $isEntry }) => !$isEntry && `padding-left: 0;`}

  svg {
    height: 20px;
    margin-right: 5px;
  }

  display: flex;
  justify-content: space-between;
`

// TODO: redefine NavBack to accept a callback and label instead of isEntry
const NavBack = ({ isEntry }) => {
  const history = useAppHistory()
  const { state } = useLocation()
  const { t } = useTranslation()
  const match = useRouteMatch('/entry/:id')
  const entryId = match?.params.id

  const handleBackButtonClick = () => {
    // Default to going back to the map. This occurs when the user opens /entry/{typeId} directly
    history.push(state?.fromPage ?? '/map')
  }

  return (
    <StyledNavBack $isEntry={isEntry}>
      <BackButton onClick={handleBackButtonClick}>
        <ArrowBack />
        {t('Back')}
      </BackButton>
      {isEntry && (
        <BackButton onClick={() => history.push(`/entry/${entryId}/edit`)}>
          <Pencil />
          Edit
        </BackButton>
      )}
    </StyledNavBack>
  )
}

export default NavBack
