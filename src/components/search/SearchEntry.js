import { Map, Navigation } from '@styled-icons/boxicons-solid'
import React from 'react'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry, { PrimaryText, SecondaryText } from '../ui/ListEntry'

const SearchEntry = React.forwardRef(
  ({ children, isCurrentLocation, ...props }, ref) => {
    const [primaryText, secondaryText] = children

    const leftIcon = (
      <CircleIcon
        backgroundColor={isCurrentLocation ? theme.blue : theme.secondaryText}
      >
        <Map color={theme.background} />
      </CircleIcon>
    )

    return (
      <ListEntry
        leftIcons={leftIcon}
        rightIcons={<Navigation size={20} color={theme.blue} />}
        ref={ref}
        {...props}
      >
        <PrimaryText>{primaryText}</PrimaryText>
        <SecondaryText>{secondaryText}</SecondaryText>
      </ListEntry>
    )
  },
)

SearchEntry.displayName = 'SearchEntry'

export default SearchEntry
