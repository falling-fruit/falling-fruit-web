import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import PagedList from '../list/PagedList'
import SquareButton from '../ui/SquareButton'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledPageInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`

const StyledPageNav = styled.div`
  display: flex;
`

const ListWrapper = () => (
  <StyledContainer>
    <PagedList />
    <StyledPageInfo>
      Showing Results 1 - 30
      <StyledPageNav>
        <SquareButton icon={<ChevronLeft />} />
        <SquareButton icon={<ChevronRight />} />
      </StyledPageNav>
    </StyledPageInfo>
  </StyledContainer>
)

export default ListWrapper
