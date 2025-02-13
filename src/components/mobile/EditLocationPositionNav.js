import { Check, X } from '@styled-icons/boxicons-regular'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { updatePosition } from '../../redux/locationSlice'
import { distanceInMeters } from '../../utils/mapDistance'
import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import IconButton from '../ui/IconButton'
import TopBarNav from '../ui/TopBarNav'

const Instructions = styled.span`
  margin-left: 15px;
`

const EditLocationPositionNav = () => {
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { locationId } = useParams()
  const { googleMap } = useSelector((state) => state.map)
  const { position: storedPosition } = useSelector((state) => state.location)

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
    dispatch(updatePosition(googleMap?.getCenter().toJSON()))
    history.push(`/locations/${locationId}/edit`)
  }

  return (
    <TopBarNav
      left={<Instructions>Edit location position.</Instructions>}
      rightIcons={
        <>
          <IconButton
            label="Cancel edit position"
            icon={<X />}
            raised
            size={54}
            onClick={handleCancel}
          />
          <IconButton
            label="Confirm edit position"
            icon={<Check />}
            raised
            size={54}
            color={theme.green}
            onClick={handleConfirm}
          />
        </>
      }
    />
  )
}

export default EditLocationPositionNav
