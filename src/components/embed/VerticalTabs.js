import '@reach/tabs/styles.css'

import {
  Tab as ReachTab,
  TabList as ReachTabList,
  TabPanel as ReachTabPanel,
  TabPanels as ReachTabPanels,
  Tabs,
} from '@reach/tabs'
import styled from 'styled-components/macro'

const VerticalTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
  .vertical-tab-list[data-reach-tab-list] {
    flex-direction: column;
    height: auto;
    background: ${({ theme }) => theme.background};

    .vertical-tab[data-reach-tab] {
      flex-direction: row;
      justify-content: flex-start;
      padding: 8px 16px;
      border-top: none;
      border-left: 4px solid ${({ theme }) => theme.secondaryBackground};
      text-align: left;
      font-size: 1em;
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;

      svg {
        margin-inline: 0.5em !important;
        display: inline-block;
        margin-block: 0 !important;
        vertical-align: middle;
        height: 24px;
      }

      &[data-selected] {
        border-top: none;
        border-left-color: ${({ theme }) => theme.orange};
      }
    }
  }
`

const Tab = styled(ReachTab).attrs({ className: 'vertical-tab' })``
const TabList = styled(ReachTabList).attrs({ className: 'vertical-tab-list' })``
const TabPanel = styled(ReachTabPanel).attrs({
  className: 'vertical-tab-panel',
})``
const TabPanels = styled(ReachTabPanels).attrs({
  className: 'vertical-tab-panels',
})``

export { Tab, TabList, TabPanel, TabPanels, VerticalTabs }
