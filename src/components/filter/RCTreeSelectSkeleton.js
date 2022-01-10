import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

const TreeSelectContainer = styled.div`
  height: 100%;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 7px;
  padding: 0.5em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 12px;
  @media ${({ theme }) => theme.device.mobile} {
    height: 50vh;
  }
`

const RCTreeSelectSkeleton = () => (
  <TreeSelectContainer>
    {new Array(32).fill(null).map((_, idx) => (
      <Skeleton key={idx} width={Math.random() * 150 + 150} />
    ))}
  </TreeSelectContainer>
)

export default RCTreeSelectSkeleton
