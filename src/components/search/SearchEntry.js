import { Map, Navigation } from '@styled-icons/boxicons-solid'
import React from 'react'

import ListEntry from '../ui/ListEntry'
const SearchEntry = React.forwardRef(({ children, onClick }, ref) => {
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
      onClick={onClick}
      ref={ref}
    />
  )
})

SearchEntry.displayName = 'SearchEntry'

export default SearchEntry