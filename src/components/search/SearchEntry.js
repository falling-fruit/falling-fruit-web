import { CurrentLocation } from '@styled-icons/boxicons-regular/CurrentLocation'
import { Map, Navigation } from '@styled-icons/boxicons-solid'
import React from 'react'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'

const SearchEntry = React.forwardRef(
  ({ children, isCurrent, ...props }, ref) => {
    const [primaryText, secondaryText] = children

    const leftIcon = isCurrent ? (
      <CircleIcon backgroundColor={theme.blue}>
        <CurrentLocation color={theme.background} />
      </CircleIcon>
    ) : (
      <CircleIcon backgroundColor={theme.secondaryText}>
        <Map color={theme.background} />
      </CircleIcon>
    )

    return (
      <ListEntry
        leftIcons={leftIcon}
        primaryText={primaryText}
        secondaryText={secondaryText}
        rightIcons={<Navigation size={20} color={theme.blue} />}
        ref={ref}
        {...props}
      />
    )
  },
)

SearchEntry.displayName = 'SearchEntry'

export default SearchEntry
