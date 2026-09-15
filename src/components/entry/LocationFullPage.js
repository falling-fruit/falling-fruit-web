import styled from 'styled-components/macro'

import { NAVIGATION_BAR_HEIGHT_PX } from '../../constants/mobileLayout'
import { zIndex } from '../ui/GlobalStyle'

/**
 * Full-screen page shell for a fully-open location. Unlike the bottom sheet,
 * it is positioned entirely by CSS: pinned to the viewport with env() safe
 * areas, exactly like the other mobile pages (settings, list). There is no
 * JS-computed top offset, so there is no post-load height hop and structurally
 * no gap between the map and the page.
 *
 * The white page rests below a top band, matching the deployed layout:
 * - with an image, the image occupies the top of the page (band = 0);
 * - without an image, the page rests below the navigation bar height so the
 *   area above stays clear (band = NAVIGATION_BAR_HEIGHT_PX), reproducing the
 *   old fully-open pane which rested at translateY(topPositionHeight).
 *
 * The shared LocationContent inside is a flex column whose CardTabs panels
 * scroll internally (sticky tab list), preserving the existing scroll
 * behaviour.
 */
const FullPageContainer = styled.div`
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

const LocationFullPage = ({ hasImages, children }) => (
  <FullPageContainer hasImages={hasImages}>{children}</FullPageContainer>
)

export default LocationFullPage
