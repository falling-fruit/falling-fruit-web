import { CurrentLocation, LoaderAlt } from '@styled-icons/boxicons-regular'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
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
` // TODO: whole icon is spinning for some reason

const SpinningLoader = styled(LoaderAlt)`
  animation: 1s linear ${spin} infinite;
`

const getTrackLocationColor = ({ userDeniedLocation, $active }) =>
  $active && !userDeniedLocation ? 'blue' : 'tertiaryText'

const TrackLocationIcon = ({ userDeniedLocation, $loading, ...props }) => {
  if (userDeniedLocation) {
    return <CurrentLocation opacity="0.5" {...props} />
  } else if ($loading) {
    return <SpinningLoader {...props} />
  } else {
    return <CurrentLocation {...props} />
  }
}

const TrackLocationPrependButton = styled.button.attrs((props) => ({
  children: <TrackLocationIcon {...props} />,
}))`
  padding-left: 3px;
  padding-right: 8px;

  cursor: ${({ userDeniedLocation }) =>
    userDeniedLocation ? 'help' : 'pointer'};

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
    padding: 10px;
  }
  cursor: ${({ userDeniedLocation }) =>
    userDeniedLocation ? 'help' : 'pointer'};

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
  const userDeniedLocation = useSelector(
    (state) => state.map.userDeniedLocation,
  )

  const TrackLocationBtn = isIcon
    ? TrackLocationIconButton
    : TrackLocationPrependButton

  return (
    <TrackLocationBtn
      userDeniedLocation={userDeniedLocation}
      $loading={geolocation?.loading}
      $active={isTrackingLocation}
      onClick={(event) => {
        if (userDeniedLocation) {
          toast.info(
            'Permission to use your location was denied. To enable geolocation, please allow location sharing in your browser settings and refresh the page.'
          )
        } else {
          dispatch(startTrackingLocation())
        }
        event.stopPropagation()
      }}
    />
  )
}

export default TrackLocationButton
