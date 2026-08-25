import { Check, X } from '@styled-icons/boxicons-regular'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { updatePosition } from '../../redux/locationSlice'
import { isTooClose } from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-inline-start: 15px;
`

const EditLocationPositionNav = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { locationId } = useParams()
  const { locations } = useSelector((state) => state.map)
  const {
    position: storedPosition,
    location,
    form,
  } = useSelector((state) => state.location)

  const editingId = Number(locationId)
  const tooClose =
    storedPosition && isTooClose(storedPosition, locations, editingId)

  const handleCancel = () => {
    // Revert to the position the user last set in the form
    const revertPosition =
      form?.position || (location && { lat: location.lat, lng: location.lng })
    if (revertPosition) {
      dispatch(updatePosition(revertPosition))
    }
    history.push(`/locations/${locationId}/edit`)
  }

  const handleConfirm = () => {
    if (tooClose) {
      toast.warning(t('locations.init.position_too_close'))
    } else {
      // storedPosition already reflects the draggable marker's position via redux
      history.push(`/locations/${locationId}/edit`)
    }
  }

  return (
    <TopBarNav
      left={
        <Instructions>{t('locations.edit_position.instructions')}</Instructions>
      }
      rightIcons={
        <>
          <IconButton
            label={t('locations.edit_position.cancel')}
            icon={<X />}
            raised
            size={54}
            onClick={handleCancel}
          />
          <IconButton
            label={t('locations.edit_position.confirm')}
            icon={<Check />}
            raised
            size={54}
            color={theme.green}
            onClick={handleConfirm}
            style={{
              opacity: tooClose ? 0.5 : 1,
              cursor: tooClose ? 'help' : 'pointer',
            }}
          />
        </>
      }
    />
  )
}

export default EditLocationPositionNav
