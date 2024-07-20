import { Plus } from '@styled-icons/boxicons-regular'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import IconButton from './IconButton'

const StyledAddLocationButton = styled(IconButton)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  opacity: ${({ greyedOut }) => (greyedOut ? '0.5' : '1')};
  cursor: ${({ greyedOut }) => (greyedOut ? 'help' : 'pointer')};
`

const AddLocationButton = ({ onClick }) => {
  const { googleMap } = useSelector((state) => state.map)
  const isZoomSufficient =
    !googleMap || googleMap.getZoom() >= VISIBLE_CLUSTER_ZOOM_LIMIT

  return (
    <StyledAddLocationButton
      label="Add entry"
      size={68}
      icon={<Plus />}
      raised
      onClick={onClick}
      greyedOut={!isZoomSufficient}
    />
  )
}

export default AddLocationButton
