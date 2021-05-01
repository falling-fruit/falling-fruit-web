import styled from 'styled-components/macro'

import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'

const EntryTab = styled(PageTabs)`
  [data-reach-tab-list] {
    height: 50px;
    [data-reach-tab] {
      display: flex;

      font-size: 14px;
      border-top: none;

      border-bottom: 3px solid ${({ theme }) => theme.secondaryBackground};
      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-bottom-color: ${({ theme }) => theme.orange};
      }
    }
  }
`
export { EntryTab, Tab, TabList, TabPanel, TabPanels }
