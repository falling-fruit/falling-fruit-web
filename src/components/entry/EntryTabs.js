import styled from 'styled-components/macro'

import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import EntryDetails from './EntryDetails'
import EntryReviews from './EntryReviews'

// Wraps the entire page and gives it a top margin if on mobile
export const Page = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    padding-top: 87px;
  }

  overflow: auto;
  width: 100%;
`

export const TextContent = styled.article`
  padding: 20px 23px;

  @media ${({ theme }) => theme.device.desktop} {
    padding: 12px;
  }
  h2 {
    font-size: 18px;
  }

  box-sizing: border-box;

  ul {
    margin: 0 0 12px 0;
  }
`

// TODO: create /ui/EntryTabs.js, and move all UI stuff into it. Mirror the PageTabs
// Rename Overview and Reviews
const EntryTab = styled(PageTabs)`
  [data-reach-tab-list] {
    height: 40px;
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

const EntryTabs = () => {
  console.log('tabs')

  return (
    <EntryTab>
      <TabList>
        {/* TODO: Use Routing */}
        <Tab>Overview</Tab>
        <Tab>Reviews</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <EntryDetails />
        </TabPanel>
        <TabPanel>
          <EntryReviews />
        </TabPanel>
      </TabPanels>
    </EntryTab>
  )
}

export default EntryTabs
