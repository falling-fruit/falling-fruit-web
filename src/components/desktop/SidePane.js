import styled from 'styled-components/macro'

import Search from '../search/Search'

const PaneContainer = styled.div`
  padding: 20px 0 20px 10px;
`

const SidePane = () => (
  <PaneContainer>
    <Search />
  </PaneContainer>
)

export default SidePane
