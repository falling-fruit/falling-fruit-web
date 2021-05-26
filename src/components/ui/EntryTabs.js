import styled from 'styled-components/macro'

import { PageTabs } from '../ui/PageTabs'

const EntryTabs = styled(PageTabs)`
  [data-reach-tab-list] {
    height: 50px;

    [data-reach-tab] {
      display: flex;

      font-size: 0.875rem;
      border-top: none;

      border-bottom: 3px solid ${({ theme }) => theme.secondaryBackground};
      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-bottom-color: ${({ theme }) => theme.orange};
      }
    }
  }
  [data-reach-tab-panels] [data-reach-tab-panel] {
    overflow: auto;
  }
`

export { Tab, TabList, TabPanel, TabPanels } from '@reach/tabs'
export { EntryTabs }
