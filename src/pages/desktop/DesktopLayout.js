import { ListUl } from '@styled-icons/boxicons-regular'
import { Cog, Flag, MapAlt, Star } from '@styled-icons/boxicons-solid'

import Button from '../../components/ui/Button'
import {
  PageTabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '../../components/ui/PageTabs'

const DesktopLayout = () => (
  <PageTabs defaultIndex={1}>
    <TabPanels>
      <TabPanel>
        <p>Settings</p>
        <Button icon={<Star />}>Review</Button>
        <Button icon={<Flag />} secondary>
          Report
        </Button>
        <br />
        <br />
      </TabPanel>
      <TabPanel>You're on the desktop layout</TabPanel>
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

export default DesktopLayout
