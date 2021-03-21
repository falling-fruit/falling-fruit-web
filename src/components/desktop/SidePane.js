import styled from 'styled-components'

import Search from '../search/Search'

const PaneContainer = styled.div`
  padding: 20px 10px;
  padding-right: 0px;
`

const SidePane = () => (
  <PaneContainer>
    <Search />
  </PaneContainer>
)

export default SidePane
