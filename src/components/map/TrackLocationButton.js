import { CurrentLocation, LoaderAlt } from '@styled-icons/boxicons-regular'
import { XCircle } from '@styled-icons/boxicons-solid'
import { useDispatch, useSelector } from 'react-redux'
import { keyframes } from 'styled-components'
import styled from 'styled-components/macro'

import { startTrackingLocation } from '../../redux/mapSlice'
import IconButton from '../ui/IconButton'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const SpinningLoader = styled(LoaderAlt)`
  animation: 1s linear ${spin} infinite;
`

const getTrackLocationColor = ({ $disabled, $active }) =>
  $active && !$disabled ? 'blue' : 'tertiaryText'

const TrackLocationIcon = ({ $disabled, $loading, ...props }) => {
  if ($disabled) {
    return <XCircle {...props} /> // TODO: replace this with a specific "disabled geolocation" icon, like Google Maps has
  } else if ($loading) {
    return <SpinningLoader {...props} />
  } else {
    return <CurrentLocation {...props} />
  }
}

const TrackLocationPrependButton = styled.button.attrs((props) => ({
  children: <TrackLocationIcon {...props} />,
}))`
  &:enabled {
    cursor: pointer;
  }

  svg {
    color: ${({ theme, ...props }) => theme[getTrackLocationColor(props)]};
  }
`

const TrackLocationIconButton = styled(IconButton).attrs((props) => ({
  label: 'Track location',
  size: 68,
  icon: <TrackLocationIcon {...props} />,
  color: props.theme[getTrackLocationColor(props)],
  raised: true,
  ...props,
}))`
  svg {
    padding: 15px;
  }

  position: absolute;
  bottom: 84px;
  right: 10px;
  z-index: 1;
`

const TrackLocationButton = ({ isIcon }) => {
  const dispatch = useDispatch()
  const geolocation = useSelector((state) => state.map.geolocation)
  const isTrackingLocation = useSelector(
    (state) => state.map.isTrackingLocation,
  )

  const TrackLocationBtn = isIcon
    ? TrackLocationIconButton
    : TrackLocationPrependButton

  return (
    <TrackLocationBtn
      $disabled={geolocation?.error}
      $loading={geolocation?.loading}
      $active={isTrackingLocation}
      onClick={() => {
        dispatch(startTrackingLocation())
      }}
    />
  )
}

export default TrackLocationButton
