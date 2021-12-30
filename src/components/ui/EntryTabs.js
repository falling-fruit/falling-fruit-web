import styled from 'styled-components/macro'

import { PageTabs } from '../ui/PageTabs'

const EntryTabs = styled(PageTabs)`
  // TODO: make this snippet reusable (copied from ../GlobalStyle.js)
  @media ${({ theme }) => theme.mobile} {
    // Disable overscrolling on iOS
    overflow: hidden;
    position: fixed;
    height: 100%;
    width: 100%;
  }

  [data-reach-tab-list] {
    height: 50px;
    position: sticky;
    z-index: 2;
    top: 0;

    [data-reach-tab] {
      display: flex;

      font-size: 0.875rem;
      color: ${({ theme }) => theme.secondaryText};

      border-top: 2px solid ${({ theme }) => theme.secondaryBackground};
      border-bottom: 2px solid ${({ theme }) => theme.secondaryBackground};
      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-bottom-color: ${({ theme }) => theme.orange};
        border-top-color: ${({ theme }) => theme.secondaryBackground};
      }
    }
  }
  [data-reach-tab-panels] [data-reach-tab-panel] {
    overflow: auto;
  }
`

export { Tab, TabList, TabPanel, TabPanels } from '@reach/tabs'
export { EntryTabs }
