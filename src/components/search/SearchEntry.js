import { CursorFill } from '@styled-icons/bootstrap'
import { Map } from '@styled-icons/boxicons-solid'

import ListEntry from '../ui/ListEntry'
const SearchEntry = ({ children }) => {
  const [primaryText, secondaryText] = children

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
  const rightIcon = (
    <div style={{ width: '20px' }}>
      <CursorFill size={20} color={'#4183C4'} />
    </div>
  )

  return (
    <ListEntry
      leftIcons={leftIcon}
      primaryText={primaryText}
      secondaryText={secondaryText}
      rightIcons={rightIcon}
    />
  )
}

export default SearchEntry
