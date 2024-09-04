import styled from 'styled-components/macro'

import { zIndex } from './GlobalStyle'

// 80px height unless menu selections are visible
const TopBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: ${zIndex.topBar};
  background: ${({ theme }) => theme.background};
  filter: drop-shadow(0px -1px 8px ${({ theme }) => theme.shadow});
  padding: 16px;
  min-height: 48px;
  border-radius: ${(props) => (props.rectangular ? '0' : '0 0 1.5em 1.5em')};
  transition: border-radius 0.2s ease-out-in;
`

export default TopBar
