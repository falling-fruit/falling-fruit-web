import styled from 'styled-components/macro'

import { NAVIGATION_BAR_HEIGHT_PX } from '../../constants/mobileLayout'
import { zIndex } from './GlobalStyle'

const TopBar = styled.div`
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: ${zIndex.topBar};
  background: ${({ theme }) => theme.background};
  filter: drop-shadow(0px -1px 8px ${({ theme }) => theme.shadow});
  padding: calc(16px + env(safe-area-inset-top, 0)) 16px 16px 16px;
  min-height: calc(${NAVIGATION_BAR_HEIGHT_PX}px - 32px);
  border-radius: 0;
  transition: border-radius 0.2s ease-out-in;

  &::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    height: env(safe-area-inset-top, 0);
    background: ${({ theme }) => theme.secondaryBackground};
    z-index: ${zIndex.topBar + 1};
  }
`

export default TopBar
