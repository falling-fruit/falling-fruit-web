import { ListUl, SearchAlt2 as Search } from '@styled-icons/boxicons-regular'
import { Cog, Flag, MapAlt, Star } from '@styled-icons/boxicons-solid'

import MapPage from '../map/MapPage'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ListEntry from '../ui/ListEntry'
import { PageTabs, Tab, TabList, TabPanel, TabPanels } from '../ui/PageTabs'
import { Tag, TagList } from '../ui/Tag'
import Leaf from './leaf.png'

const ManyIcons = [
  <img key={1} src={Leaf} alt={'hi'} />,
  <img key={2} src={Leaf} alt={'hi'} />,
  <img key={3} src={Leaf} alt={'hi'} />,
]

const TwoIcons = [
  <img key={1} src={Leaf} alt={'hi'} />,
  <img key={2} src={Leaf} alt={'hi'} />,
]

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
        {/* TODO: Remove before merging 
        {/* <ListEntry
          leftIcon={<img src={Image} alt={'hi'}></img>}
          primaryText="Location"
          secondaryText="Champaign, IL"
          rightIcon={<CursorFill size={16} />}
        />
        <ListEntry
          leftIcon={<img src={Image} alt={'hi'}></img>}
          primaryText="Location"
          rightIcon={<CursorFill size={16} />}
        /> */}
        {/* <ListEntry
          primaryText="Location"
          secondaryText="Champaign, IL"
        /> */}
        <ListEntry
          primaryText="Location"
          secondaryText="Champaign, IL"
          rightIcons={ManyIcons}
          size={57}
        />
        <ListEntry
          leftIcon={TwoIcons}
          primaryText="Entry"
          rightIcons={TwoIcons}
          size={57}
        />
        <ListEntry
          leftIcon={<img src={Leaf} alt={'hi'} />}
          primaryText="Entry"
          rightIcons={TwoIcons}
        />
        <ListEntry
          leftIcon={<img src={Leaf} alt={'hi'} />}
          primaryText="Entry"
          secondaryText="0.3 miles"
        />
        <ListEntry
          primaryText="Entry"
          secondaryText="0.3 miles"
          rightIcons={TwoIcons}
          size={57}
        />
        <ListEntry
          primaryText="Entry"
          secondaryText="0.3 miles"
          rightIcons={<img src={Leaf} alt={'hi'} />}
        />

        {/* <ListEntry
          leftIcon={<Star key={32} />}
          primaryText="Entry"
          rightIcons={RightIcons}
        /> 
        <ListEntry
          leftIcon={<Star key={32} />}
          primaryText="Entry"
          rightIcons={RightIcons}
        /> 
        <ListEntry
          leftIcon={<Star key={32} />}
          primaryText="Entry"
          rightIcons={RightIcons}
        />  */}
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
