import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'

import MapPage from '../map/MapPage'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
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
      <Tab>
        <Cog />
        Settings
      </Tab>
      <Tab>
        <MapAlt />
        Map
      </Tab>
      <Tab>
        <ListUl />
        List
      </Tab>
    </TabList>
  </PageTabs>
)

export default MobileLayout
