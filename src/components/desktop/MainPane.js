import styled from 'styled-components/macro'

import PagedList from '../list/PagedList'
import SearchOverlay from './SearchOverlay'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const MainPane = () => (
  <StyledContainer>
    <SearchOverlay />
    <PagedList />
  </StyledContainer>
)

export default MainPane
