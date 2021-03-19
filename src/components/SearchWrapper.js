import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import React, { useState } from 'react'

import Filter from './filter/Filter'
import Search from './search/Search'
import { theme } from './ui/GlobalStyle'
import IconButton from './ui/IconButton'

const SearchWrapper = () => {
  const [filterPressed, setFilterPressed] = useState(false)
  const [municipal, setMunicipal] = useState(false)
  const [invasive, setInvasive] = useState(false)

  const handleCheckboxChange = (event) => {
    event.target.name === 'municipal'
      ? setMunicipal(!municipal)
      : setInvasive(!invasive)
  }

  const handleFilterButtonClick = () => setFilterPressed(!filterPressed)

  return (
    <div>
      <Search />
      <IconButton
        size={40}
        raised={false}
        pressed={filterPressed}
        icon={
          <FilterIcon
            color={filterPressed ? theme.orange : theme.secondaryText}
          />
        }
        onClick={handleFilterButtonClick}
        label="filter-button"
      />
      <Filter handleCheckboxChange={handleCheckboxChange} />
    </div>
  )
}

export default SearchWrapper
