import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'

import MapPage from '../map/MapPage'
import { LinkTab, PageTabs, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import Settings from './Settings'
import TopBarSwitch from './TopBarSwitch'

const MobileLayout = () => (
  <PageTabs defaultIndex={1}>
    <TabPanels>
      <TopBarSwitch />
      <TabPanel>
        <Settings />
      </TabPanel>
      <TabPanel>
        <MapPage />
      </TabPanel>
      <TabPanel>
        <p>List</p>
      </TabPanel>
    </TabPanels>
    <TabList>
      <LinkTab to="/settings">
        <Cog />
        Settings
      </LinkTab>
      <LinkTab to="/map">
        <MapAlt />
        Map
      </LinkTab>
      <LinkTab to="/list">
        <ListUl />
        List
      </LinkTab>
    </TabList>
  </PageTabs>
)

export default MobileLayout
