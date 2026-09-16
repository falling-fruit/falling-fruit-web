import styled from 'styled-components/macro'

import { NAVIGATION_BAR_HEIGHT_PX } from '../../constants/mobileLayout'
import { zIndex } from '../ui/GlobalStyle'

const LocationFullPage = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-start: ${(props) =>
    props.hasImages
      ? '0'
      : `calc(${NAVIGATION_BAR_HEIGHT_PX}px + env(safe-area-inset-top, 0))`};
  inset-block-end: 0;
  z-index: ${zIndex.topBar + 1};
  background: white;
  display: flex;
  flex-direction: column;
`

export default LocationFullPage
