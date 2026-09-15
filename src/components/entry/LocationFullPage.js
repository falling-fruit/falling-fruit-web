import styled from 'styled-components/macro'

import { zIndex } from '../ui/GlobalStyle'

/**
 * Full-screen page shell for a fully-open location. Unlike the bottom sheet,
 * it is positioned entirely by CSS: pinned to the viewport with env() safe
 * areas, exactly like the other mobile pages (settings, list). There is no
 * JS-computed top offset, so there is no post-load height hop and structurally
 * no gap between the map and the page.
 *
 * The container fills the viewport; the shared LocationContent inside it is a
 * flex column whose CardTabs panels scroll internally (sticky tab list),
 * preserving the existing scroll behaviour.
 */
const FullPageContainer = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;
  inset-block-end: 0;
  z-index: ${zIndex.topBar + 1};
  background: white;
  display: flex;
  flex-direction: column;

  /* Reserve the safe area at the top when there is no image to sit under it. */
  padding-block-start: ${(props) =>
    props.hasImages ? '0' : 'env(safe-area-inset-top, 0)'};
`

const LocationFullPage = ({ hasImages, children }) => (
  <FullPageContainer hasImages={hasImages}>{children}</FullPageContainer>
)

export default LocationFullPage
