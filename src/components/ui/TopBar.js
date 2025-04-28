import styled from 'styled-components/macro'

import { zIndex } from './GlobalStyle'

const TopBar = styled.div`
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: ${zIndex.topBar};
  background: ${({ theme }) => theme.background};
  filter: drop-shadow(0px -1px 8px ${({ theme }) => theme.shadow});
  padding: 16px;
  min-height: 48px;
  border-radius: 0;
  transition: border-radius 0.2s ease-out-in;
`

export default TopBar
