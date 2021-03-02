import styled from 'styled-components'

const TopBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
  background: ${({ theme }) => theme.background};
  border-radius: 0 0 44px 44px;
  filter: drop-shadow(0px -1px 8px ${({ theme }) => theme.shadow});
  padding: 16px;
`

export default TopBar
