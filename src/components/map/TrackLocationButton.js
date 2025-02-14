import { CurrentLocation, LoaderAlt } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { keyframes } from 'styled-components'
import styled from 'styled-components/macro'

import { MIN_GEOLOCATION_ZOOM } from '../../constants/map'
import {
  disableGeolocation,
  geolocationCentering,
  GeolocationState,
  requestGeolocation,
} from '../../redux/geolocationSlice'
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

const getTrackLocationColor = (geolocationState) =>
  geolocationState === GeolocationState.CENTERING ||
  geolocationState === GeolocationState.TRACKING ||
  geolocationState === GeolocationState.DOT_ON
    ? 'blue'
    : 'tertiaryText'

const getCursorStyle = (geolocationState) => {
  if (geolocationState === GeolocationState.DENIED) {
    return 'help'
  }
  if (geolocationState === GeolocationState.LOADING) {
    return 'wait'
  }
  return 'pointer'
}

const TrackLocationIcon = ({ geolocationState, ...props }) => {
  if (geolocationState === GeolocationState.DENIED) {
    return <CurrentLocation opacity="0.5" {...props} />
  } else if (geolocationState === GeolocationState.LOADING) {
    return <SpinningLoader {...props} />
  } else if (geolocationState === GeolocationState.DOT_ON) {
    return <CurrentLocation opacity="0.8" {...props} />
  } else {
    return <CurrentLocation {...props} />
  }
}

const TrackLocationPrependButton = styled.button.attrs((props) => ({
  children: <TrackLocationIcon {...props} />,
}))`
  padding-left: 3px;
  padding-right: 8px;

  cursor: ${({ geolocationState }) => getCursorStyle(geolocationState)};

  svg {
    color: ${({ theme, geolocationState }) =>
      theme[getTrackLocationColor(geolocationState)]};
  }
`

const TrackLocationIconButton = styled(IconButton).attrs((props) => ({
  label: 'Track location',
  size: 68,
  icon: <TrackLocationIcon {...props} />,
  color: props.theme[getTrackLocationColor(props.geolocationState)],
  raised: true,
  ...props,
}))`
  svg {
    padding: 10px;
  }
  cursor: ${({ geolocationState }) => getCursorStyle(geolocationState)};

  position: absolute;
  bottom: 84px;
  right: 10px;
  z-index: 1;
`

const TrackLocationButton = ({ isIcon }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { geolocation, geolocationState } = useSelector(
    (state) => state.geolocation,
  )

  const TrackLocationBtn = isIcon
    ? TrackLocationIconButton
    : TrackLocationPrependButton

  const { googleMap } = useSelector((state) => state.map)

  return (
    <TrackLocationBtn
      geolocationState={geolocationState}
      onClick={(event) => {
        if (geolocationState === GeolocationState.DENIED) {
          toast.info(t('error_message.geolocation.denied'))
        } else if (geolocationState === GeolocationState.DOT_ON) {
          dispatch(geolocationCentering(geolocation))
          googleMap.panTo({
            lat: geolocation.latitude,
            lng: geolocation.longitude,
          })
          if (googleMap.getZoom() < MIN_GEOLOCATION_ZOOM) {
            googleMap.setZoom(MIN_GEOLOCATION_ZOOM)
          }
        } else if (geolocationState === GeolocationState.INITIAL) {
          dispatch(requestGeolocation())
        } else {
          dispatch(disableGeolocation())
        }
        event.stopPropagation()
      }}
      disabled={geolocationState === GeolocationState.LOADING}
    />
  )
}

export default TrackLocationButton
