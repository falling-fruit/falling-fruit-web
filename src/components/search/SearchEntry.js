import { Map, Navigation } from '@styled-icons/boxicons-solid'

import ListEntry from '../ui/ListEntry'
const SearchEntry = ({ children }) => {
  console.log(children)
  const [primaryText, secondaryText] = children

  // TODO: change colors to theme colors

  const leftIcon = (
    <div
      style={{
        background: '#5A5A5A',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
      }}
    >
      <Map size={20} color={'white'} />
    </div>
  )

  return (
    <ListEntry
      leftIcons={leftIcon}
      primaryText={primaryText}
      secondaryText={secondaryText}
      rightIcons={<Navigation size={20} color={'#4183C4'} />}
    />
  )
}

export default SearchEntry
