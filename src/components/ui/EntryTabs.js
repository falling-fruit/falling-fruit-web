import { Tab as BaseTab } from '@reach/tabs'
import styled from 'styled-components/macro'

import { PageTabs } from '../ui/PageTabs'

const EntryTabs = styled(PageTabs)`
  // TODO: make this snippet reusable (copied from ../GlobalStyle.js)
  background-color: white;
  @media ${({ theme }) => theme.device.mobile} {
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
const Tab = styled(BaseTab)`
  ${({ greyedOut }) =>
    greyedOut &&
    `
          pointer-events: none;
          cursor: default;
        `}
`

export { TabList, TabPanel, TabPanels } from '@reach/tabs'
export { EntryTabs, Tab }
