import { SearchAlt2 as Search } from '@styled-icons/boxicons-regular'
import { Flag, Star } from '@styled-icons/boxicons-solid'

import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import Input from '../ui/Input'
import ListEntry from '../ui/ListEntry'
import { Tag, TagList } from '../ui/Tag'

const TwoIcons = [<Star size="16" key={1} />, <Star size="16" key={2} />]

const SettingsPage = () => (
  <>
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
    <ListEntry
      leftIcons={<Star size="16" />}
      primaryText="Entry"
      secondaryText="0.3 miles"
    />
    <ListEntry
      primaryText="Entry"
      secondaryText="0.3 miles"
      rightIcons={TwoIcons}
      size={57}
    />
    <ListEntry primaryText="Entry" rightIcons={<Star size="16" />} />
    <Checkbox checked></Checkbox>
    <Checkbox checked={false}></Checkbox>
    <Checkbox checked={'mixed'}></Checkbox>
  </>
)

export default SettingsPage
