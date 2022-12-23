import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

const TreeSelectContainer = styled.div`
  height: 100%;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;
  padding: 0.5em;
  box-sizing: border-box;

  overflow: hidden;
  margin-bottom: 12px;
  @media ${({ theme }) => theme.device.mobile} {
    height: 50vh;
  }
  position: relative;

  div {
    position: absolute;
    display: flex;
    flex-direction: column;
  }
`

const RCTreeSelectSkeleton = () => (
  <TreeSelectContainer>
    <div>
      {new Array(32).fill(null).map((_, idx) => (
        <Skeleton key={idx} width={Math.random() * 100 + 120} />
      ))}
    </div>
  </TreeSelectContainer>
)

export default RCTreeSelectSkeleton
