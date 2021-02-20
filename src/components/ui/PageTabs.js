import '@reach/tabs/styles.css'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { StyledIconBase } from '@styled-icons/styled-icon'
import styled from 'styled-components'

const PageTabs = styled(Tabs)`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;

  [data-reach-tab-list] {
    display: flex;
    background: ${({ theme }) => theme.background};

    [data-reach-tab] {
      flex-grow: 1;
      background: ${({ theme }) => theme.background};
      height: ${({ theme }) => theme.tabsHeight};
      border-top: 8px solid ${({ theme }) => theme.secondaryBackground};
      border-bottom: none;

      ${StyledIconBase} {
        display: block;
        margin: 0 auto 6px;
        height: 32px;
      }

      &:not([data-selected]) {
        ${StyledIconBase} {
          color: ${({ theme }) => theme.secondaryBackground};
        }
      }

      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-top-color: ${({ theme }) => theme.orange};

        ${StyledIconBase} {
          color: ${({ theme }) => theme.orange};
        }
      }
    }
  }
`

export { PageTabs, Tab, TabList, TabPanel, TabPanels }
