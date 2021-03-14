import styled from 'styled-components/macro'

import SearchOverlay from './SearchOverlay'

const PaneContainer = styled.div``

const SidePane = () => (
  <PaneContainer>
    <SearchOverlay />
  </PaneContainer>
)

export default SidePane
