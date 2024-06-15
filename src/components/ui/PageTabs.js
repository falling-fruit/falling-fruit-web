import '@reach/tabs/styles.css'

import { Tabs } from '@reach/tabs'
import { StyledIconBase } from '@styled-icons/styled-icon'
import styled from 'styled-components/macro'

const PageTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;

  [data-reach-tab-panels] {
    flex: 1;
    display: flex;
    overflow: hidden;

    [data-reach-tab-panel],
    > div {
      flex: 1;
    }
  }

  [data-reach-tab-list] {
    display: flex;
    height: 50px;

    background: ${({ theme }) => theme.background};
    // Moves tab buttons above home bar on iOS mobile
    padding-bottom: env(safe-area-inset-bottom, 0);

    [data-reach-tab] {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-top: 4px solid ${({ theme }) => theme.secondaryBackground};
      font-size: 0.675rem;

      border-bottom: none;

      :focus {
        outline: none;
      }

      ${StyledIconBase} {
        display: block;
        margin: 0 auto 2px;
        height: 24px;
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

export { Tab, TabList, TabPanel, TabPanels } from '@reach/tabs'
export { PageTabs }
