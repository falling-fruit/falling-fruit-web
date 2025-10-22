import styled from 'styled-components/macro'

import { TABS_HEIGHT_PX } from '../../constants/mobileLayout'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { PageTabs } from '../ui/PageTabs'

const StyledEntryTabs = styled(PageTabs)`
  // TODO: make this snippet reusable (copied from ../GlobalStyle.js)
  background-color: white;
  ${({ isDesktop }) =>
    !isDesktop &&
    `
    width: 100%;
  `}

  [data-reach-tab-list] {
    height: ${TABS_HEIGHT_PX}px;
    position: sticky;
    z-index: 2;
    top: 0;

    [data-reach-tab] {
      display: flex;

      font-size: 0.875rem;
      color: ${({ theme }) => theme.secondaryText};

      border-block-start: 2px solid ${({ theme }) => theme.secondaryBackground};
      border-block-end: 2px solid ${({ theme }) => theme.secondaryBackground};
      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-block-end-color: ${({ theme }) => theme.orange};
        border-block-start-color: ${({ theme }) => theme.secondaryBackground};
      }
    }
  }
  [data-reach-tab-panels] [data-reach-tab-panel] {
    overflow: auto;
  }
`

export const EntryTabs = ({ children, ...props }) => {
  const isDesktop = useIsDesktop()

  return (
    <StyledEntryTabs isDesktop={isDesktop} {...props}>
      {children}
    </StyledEntryTabs>
  )
}

export { Tab, TabList, TabPanel, TabPanels } from '@reach/tabs'
