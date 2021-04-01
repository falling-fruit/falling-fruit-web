import { Map, Navigation } from '@styled-icons/boxicons-solid'
import React from 'react'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'

const SearchEntry = React.forwardRef(({ children, ...props }, ref) => {
  const [primaryText, secondaryText] = children

  // TODO: Add current location to search dropdown
  const leftIcon = (
    <CircleIcon backgroundColor={theme.secondaryText}>
      <Map color={theme.background} />
    </CircleIcon>
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
