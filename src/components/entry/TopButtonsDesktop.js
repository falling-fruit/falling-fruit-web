import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import { DeleteButton, EditButton } from '../ui/ActionButtons'
import { useDeleteLocation } from './useDeleteLocation'

const ButtonGroup = styled.div`
  display: flex;
  gap: 1em;
`

const TopButtonsDesktop = () => {
  const history = useAppHistory()
  const { locationId } = useSelector((state) => state.location)
  const { handleClickDelete, isDeleteVisible, isDeleteDisabled } =
    useDeleteLocation()

  return (
    <ButtonGroup>
      {isDeleteVisible && (
        <DeleteButton
          onClick={() => handleClickDelete(locationId)}
          style={{
            opacity: isDeleteDisabled ? 0.5 : 1,
            cursor: isDeleteDisabled ? 'help' : 'pointer',
          }}
        />
      )}
      <EditButton
        onClick={() => history.push(`/locations/${locationId}/edit`)}
      />
    </ButtonGroup>
  )
}

export default TopButtonsDesktop
