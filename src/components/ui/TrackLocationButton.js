import { LoaderAlt } from '@styled-icons/boxicons-regular'
import { Navigation, XCircle } from '@styled-icons/boxicons-solid'
import { keyframes } from 'styled-components'
import styled from 'styled-components/macro'

import IconButton from './IconButton'

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

const TrackLocationButton = styled(IconButton).attrs((props) => ({
  label: 'Track location',
  size: 68,
  icon: props.$disabled ? (
    <XCircle /> // TODO: replace this with a specific "disabled geolocation" icon, like Google Maps has
  ) : props.$loading ? (
    <SpinningLoader />
  ) : (
    <Navigation />
  ),
  color:
    props.$active && !props.$disabled
      ? props.theme.blue
      : props.theme.tertiaryText,
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

export default TrackLocationButton
