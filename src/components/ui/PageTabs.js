import '@reach/tabs/styles.css'

import { Tabs } from '@reach/tabs'
import { StyledIconBase } from '@styled-icons/styled-icon'
import styled from 'styled-components/macro'

import { TABS_HEIGHT_PX } from '../../constants/mobileLayout'

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
    height: ${TABS_HEIGHT_PX}px;

    background: ${({ theme }) => theme.background};
    // Moves tab buttons above home bar on iOS mobile
    padding-block-end: env(safe-area-inset-bottom, 0);

    [data-reach-tab] {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-block-start: 4px solid ${({ theme }) => theme.secondaryBackground};
      font-size: 0.675rem;

      border-block-end: none;

      :focus {
        outline: none;
      }

      ${StyledIconBase} {
        display: block;
        margin-inline: auto;
        margin-block: 0 2px;
        height: 24px;
      }

      &[data-selected] {
        color: ${({ theme }) => theme.orange};
        border-block-start-color: ${({ theme }) => theme.orange};

        ${StyledIconBase} {
          color: ${({ theme }) => theme.orange};
        }
      }
    }
  }
`

export { Tab, TabList, TabPanel, TabPanels } from '@reach/tabs'
export { PageTabs }
