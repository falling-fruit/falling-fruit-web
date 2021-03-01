import { SearchAlt2 } from '@styled-icons/boxicons-regular'

import Input from '../ui/Input'

const Search = () => (
  <Input
    placeholder="Search for a location..."
    onChange={(e) => console.log(e.target.value)}
    onEnter={(e) => window.alert(`Received:\n${e?.target?.value}`)}
    icon={<SearchAlt2 />}
  />
)

export default Search
