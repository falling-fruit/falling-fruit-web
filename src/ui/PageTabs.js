import '@reach/tabs/styles.css'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { StyledIconBase } from '@styled-icons/styled-icon'
import styled from 'styled-components'

const PageTabs = styled(Tabs)`
  color: ${({ theme }) => theme.textColor};

  [data-reach-tab-list] {
    display: flex;
    background: white;
  }

  [data-reach-tab] {
    flex-grow: 1;
    background: white;
    height: 86px;
    border-top: 8px solid #e0e1e2;
    border-bottom: none;
  }

  ${StyledIconBase} {
    display: block;
    margin: 0 auto 6px;
    height: 34px;
  }

  :not([data-selected]) ${StyledIconBase} {
    color: #e0e1e2;
  }

  [data-selected] {
    color: #ffa41b;
    border-top-color: #ffa41b;

    ${StyledIconBase} {
      color: #ffa41b;
    }
  }
`

export { PageTabs, Tab, TabList, TabPanel, TabPanels }
