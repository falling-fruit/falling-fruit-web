import { FilterAlt } from '@styled-icons/boxicons-solid'
import React, { useState } from 'react'

import Filter from './filter/Filter'
import Search from './search/Search'
import IconButton from './ui/IconButton'

const SearchWrapper = () => {
  const [municipal, setMunicipal] = useState(false)
  const [invasive, setInvasive] = useState(false)

  const handleFilterButtonClick = (event) => {
    event.target.name === 'municipal'
      ? setMunicipal(!municipal)
      : setInvasive(!invasive)
  }

  return (
    <div>
      <Search />
      <IconButton
        size={40}
        raised={false}
        pressed
        icon={<FilterAlt />}
        onClick={handleFilterButtonClick}
        label="filter-button"
      />
      <Filter />
    </div>
  )
}

export default SearchWrapper
