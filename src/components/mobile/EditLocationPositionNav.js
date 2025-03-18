import { Check, X } from '@styled-icons/boxicons-regular'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { updatePosition } from '../../redux/locationSlice'
import { isTooClose } from '../../utils/form'
import { distanceInMeters } from '../../utils/mapDistance'
import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const EditLocationPositionNav = () => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { locationId } = useParams()
  const { googleMap, locations } = useSelector((state) => state.map)
  const { position: storedPosition } = useSelector((state) => state.location)

  const editingId = Number(locationId)
  const tooClose =
    googleMap &&
    isTooClose(googleMap.getCenter().toJSON(), locations, editingId)

  const handleCancel = () => {
    if (storedPosition && googleMap) {
      const currentCenter = googleMap.getCenter().toJSON()
      const distanceMeters = distanceInMeters(
        currentCenter.lat,
        currentCenter.lng,
        storedPosition.lat,
        storedPosition.lng,
      )

      googleMap.setCenter(storedPosition)

      if (distanceMeters > 1) {
        // Wait half a second to let the user observe the edited position being undone
        setTimeout(() => history.push(`/locations/${locationId}/edit`), 500)
      } else {
        history.push(`/locations/${locationId}/edit`)
      }
    } else {
      history.push(`/locations/${locationId}/edit`)
    }
  }

  const handleConfirm = () => {
    if (tooClose) {
      toast.warning(t('locations.init.position_too_close'))
    } else {
      dispatch(updatePosition(googleMap?.getCenter().toJSON()))
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
