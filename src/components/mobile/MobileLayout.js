import { CursorFill } from '@styled-icons/bootstrap/'
import {
  ChevronRight,
  ListUl,
  SearchAlt2 as Search,
} from '@styled-icons/boxicons-regular'
import { Cog, Flag, MapAlt, Star } from '@styled-icons/boxicons-solid'

import MapPage from '../map/MapPage'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ListEntry from '../ui/ListEntry'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { Tag, TagList } from '../ui/Tag'
import Image from './Image.png'
import Leaf from './leaf.png'
const MobileLayout = () => (
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
        <Input
          placeholder="Search for a location..."
          onChange={(e) => console.log(e.target.value)}
          onEnter={(e) => window.alert(`Received:\n${e?.target?.value}`)}
          icon={<Search />}
        />
        <br />
        <Input
          label="Demo Form Input"
          placeholder="'Sugar Maple'"
          onChange={(e) => console.log(e.target.value)}
        />
        <br />
        <TagList>
          {['Rebecca', 'Jeffrey'].map((name) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </TagList>
        <br />
      </TabPanel>
      <TabPanel>
        <MapPage />
      </TabPanel>
      <TabPanel>
        <p>List</p>
        <ListEntry
          leftIcon={<img src={Image} alt={'hi'}></img>}
          primaryText="Location"
          secondaryText="Champaign, IL"
          rightIcon={<CursorFill />}
        />
        <ListEntry
          leftIcon={<img src={Image} alt={'hi'}></img>}
          primaryText="Location"
          rightIcon={<ChevronRight />}
        />
        <ListEntry
          leftIcon={<img src={Leaf} alt={'hi'}></img>}
          primaryText="Entry"
          secondaryText="0.3 miles"
          rightIcon={<ChevronRight />}
        />
        <ListEntry
          leftIcon={<img src={Leaf} alt={'hi'}></img>}
          primaryText="Entry"
          rightIcon={<ChevronRight />}
        />
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
