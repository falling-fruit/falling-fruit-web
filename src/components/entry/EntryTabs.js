import styled from 'styled-components/macro'

import { EntryTab, Tab, TabList, TabPanel, TabPanels } from '../ui/EntryTabs'
import EntryOverview from './EntryOverview'
import EntryReviews from './EntryReviews'

// Wraps the entire page and gives it a top margin if on mobile
export const Page = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    ${({ isInDrawer }) =>
      isInDrawer ? 'padding-bottom: 27px' : 'padding-top: 87px;'}
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
    margin-top: 0;
    font-size: 18px;
  }

  box-sizing: border-box;

  ul {
    margin: 0 0 12px 0;
  }
`

const EntryTabs = ({ isInDrawer }) => (
  <Page isInDrawer={isInDrawer}>
    <EntryTab>
      <TabList>
        {/* TODO: Use Routing */}
        <Tab>Overview</Tab>
        <Tab>Reviews</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <EntryOverview />
        </TabPanel>
        <TabPanel>
          <EntryReviews />
        </TabPanel>
      </TabPanels>
    </EntryTab>
  </Page>
)

export default EntryTabs
