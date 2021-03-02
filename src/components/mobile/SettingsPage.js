import { SearchAlt2 as Search } from '@styled-icons/boxicons-regular'
import { Flag, Star } from '@styled-icons/boxicons-solid'

import Button from '../ui/Button'
import Input from '../ui/Input'
import { Tag, TagList } from '../ui/Tag'

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
  </>
)

export default SettingsPage
