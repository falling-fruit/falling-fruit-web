import { Map } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  dismissLocationTooltip,
  reopenLocationTooltip,
} from '../../redux/locationSlice'
import Tooltip from './LocationTooltip'

const AddLocationPin = styled(Map)`
  height: 57px;
  z-index: 4;
  position: absolute;
  transform: translate(-50%, -50%);
  top: -23.94px;
  color: ${({ theme }) => theme.blue};
`

const EditLocationPin = styled(Map)`
  height: 48px;
  z-index: 4;
  position: absolute;
  transform: translate(-50%, -50%);
  top: -20.16px;
  color: ${({ theme }) => theme.orange};
`

const AddLocationCentralUnmovablePin = styled(Map)`
  height: 57px;
  color: ${({ theme }) => theme.blue};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -92%);
  // Display on top of map
  z-index: 1;
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`
const EditLocationCentralUnmovablePin = styled(Map)`
  height: 48px;
  z-index: 4;

  position: absolute;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.orange};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -92%);
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`

const MapPin = EditLocationPin

EditLocationCentralUnmovablePin.defaultProps = {
  as: Map,
}

const DraggableMapPin = ({ onDragEnd, onChange, $geoService, lat, lng }) => {
  const dispatch = useDispatch()
  const { locationId, tooltipOpen } = useSelector((state) => state.location)

  const [isDragging, setIsDragging] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    e.stopPropagation()
    const { x, y } = $geoService.fromLatLngToContainerPixel({ lat, lng })
    setDragOffset({ x: e.clientX - x, y: e.clientY - y })
    setIsClicking(true)
  }

  const handleMouseUp = (e) => {
    e.stopPropagation()
    if (isClicking && !isDragging) {
      dispatch(reopenLocationTooltip())
    }
    setIsDragging(false)
    setIsClicking(false)
    const { lat: newLat, lng: newLng } = $geoService.fromContainerPixelToLatLng(
      {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      },
    )
    onDragEnd({ lat: newLat, lng: newLng })
  }

  const handleMouseMove = (e) => {
    if (isClicking) {
      setIsDragging(true)
      setIsClicking(false)
    }
    if (isDragging) {
      e.stopPropagation()
      const { lat: newLat, lng: newLng } =
        $geoService.fromContainerPixelToLatLng({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      onChange({ lat: newLat, lng: newLng })
    }
  }

  useEffect(() => {
    if (isClicking || isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isClicking, isDragging, dragOffset]) //eslint-disable-line

  const LocationPin = locationId === 'new' ? AddLocationPin : EditLocationPin

  return (
    <>
      <LocationPin
        lat={lat}
        lng={lng}
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'pointer', // 'grab' taken for panning
        }}
      />
      {tooltipOpen && (
        <Tooltip onClose={() => dispatch(dismissLocationTooltip())} />
      )}
    </>
  )
}

const BackgroundMapPin = styled(EditLocationPin)`
  z-index: 3;
  color: ${({ theme }) => theme.transparentOrange};
`

export {
  AddLocationCentralUnmovablePin,
  BackgroundMapPin,
  DraggableMapPin,
  EditLocationCentralUnmovablePin,
  MapPin,
}
