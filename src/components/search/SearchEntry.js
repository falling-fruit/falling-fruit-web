import { Map, Navigation } from '@styled-icons/boxicons-solid'
import React from 'react'

import ListEntry from '../ui/ListEntry'

const SearchEntry = React.forwardRef(({ children, ...props }, ref) => {
  const [primaryText, secondaryText] = children

  // TODO: change colors to theme colors
  // TODO: make the circle icon a reusable UI component
  const leftIcon = (
    <div
      style={{
        background: '#5A5A5A',
        width: '36px',
        height: '36px',
        boxSizing: 'border-box',
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
      ref={ref}
      {...props}
    />
  )
})

SearchEntry.displayName = 'SearchEntry'

export default SearchEntry
