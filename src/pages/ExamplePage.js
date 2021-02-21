import { ListUl } from '@styled-icons/boxicons-regular'
import {
  Cog,
  Flag,
  MapAlt,
  SearchAlt2 as Search,
  Star,
} from '@styled-icons/boxicons-solid'

import Button from '../components/ui/Button'
import StyledInput from '../components/ui/Input'
import {
  PageTabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '../components/ui/PageTabs'

const ExamplePage = () => (
  <PageTabs>
    <TabPanels>
      <TabPanel>
        <p>Settings</p>
        <Button icon={<Star />}>Review</Button>
        <Button icon={<Flag />} secondary>
          Report
        </Button>
        <br />
        <br />
        <StyledInput
          placeholder="Search for a location..."
          onChange={(e) => console.log(e.target.value)}
          onEnter={(e) => window.alert(`Received:\n${e?.target?.value}`)}
          icon={<Search />}
        />
        <br />
        <StyledInput
          label="Demo Form Input"
          placeholder="'Sugar Maple'"
          onChange={(e) => console.log(e.target.value)}
        />
        <br />
        <br />
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
