import { Navigation } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import IconButton from './IconButton'

const TrackLocationButton = styled(IconButton).attrs((props) => ({
  label: 'Track location',
  size: 68,
  icon: <Navigation />,
  color: props.$active ? props.theme.blue : props.theme.tertiaryText,
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
