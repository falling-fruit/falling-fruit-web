import '@reach/tabs/styles.css'

import {
  Tab as ReachTab,
  TabList as ReachTabList,
  TabPanel as ReachTabPanel,
  TabPanels as ReachTabPanels,
  Tabs,
} from '@reach/tabs'
import styled from 'styled-components/macro'

import { TABS_HEIGHT_PX } from '../../constants/mobileLayout'

export const CardTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;

  .card-tab-list[data-reach-tab-list] {
    display: flex;
    height: ${TABS_HEIGHT_PX}px;
    position: sticky;
    z-index: 2;
    top: 0;
    background: ${({ theme }) => theme.background};

    .card-tab[data-reach-tab] {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

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
  .card-tab-panels[data-reach-tab-panels] {
    flex: 1;
    display: flex;
    overflow: hidden;

    .card-tab-panel[data-reach-tab-panel] {
      flex: 1;
      overflow: auto;
    }
  }
`

const Tab = styled(ReachTab).attrs({ className: 'card-tab' })``
const TabList = styled(ReachTabList).attrs({ className: 'card-tab-list' })``
const TabPanel = styled(ReachTabPanel).attrs({ className: 'card-tab-panel' })``
const TabPanels = styled(ReachTabPanels).attrs({
  className: 'card-tab-panels',
})``

export { Tab, TabList, TabPanel, TabPanels }
