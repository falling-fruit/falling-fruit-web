import { CurrentLocation } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import IconButton from './IconButton'

const TrackLocationButton = styled(IconButton).attrs((props) => ({
  label: 'Track location',
  size: 68,
  icon: <CurrentLocation />,
  color: props.theme.blue,
  raised: true,
  ...props,
}))`
  svg {
    padding: 5px;
  }

  position: absolute;
  bottom: 84px;
  right: 10px;
  z-index: 1;
`

export default TrackLocationButton
