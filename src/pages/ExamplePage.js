import { PageTabs, TabList, Tab, TabPanels, TabPanel } from '../ui/PageTabs'
import { Cog, MapAlt } from '@styled-icons/boxicons-solid'
import { ListUl } from '@styled-icons/boxicons-regular'

const ExamplePage = () => (
  <PageTabs>
    <TabPanels>
      <TabPanel>
        <p>Settings</p>
      </TabPanel>
      <TabPanel>
        <p>Map</p>
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

export default ExamplePage
