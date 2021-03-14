// import { Map, Navigation } from '@styled-icons/boxicons-solid'
import { Navigation } from '@styled-icons/boxicons-solid'
import React from 'react'

import CircleIcon from '../ui/CircleIcon'
import ListEntry from '../ui/ListEntry'
// import Plantpic from './plantpic.png'
import tree from './tree.png'

const SearchEntry = React.forwardRef(({ children, ...props }, ref) => {
  const [primaryText, secondaryText] = children

  // TODO: change colors to theme colors
  // TODO: make the circle icon a reusable UI component
  const leftIcon = (
    <CircleIcon backgroundColor={'#5a5a5a'}>
      <img src={tree} alt={'plant'}></img>
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
