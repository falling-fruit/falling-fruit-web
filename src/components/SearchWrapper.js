import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Filter from './filter/Filter'
import Search from './search/Search'
import { theme } from './ui/GlobalStyle'
import IconButton from './ui/IconButton'

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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
      <SearchBarContainer>
        <Search filterPressed={filterPressed} />
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
      </SearchBarContainer>
      {filterPressed && <Filter handleCheckboxChange={handleCheckboxChange} />}
    </div>
  )
}

export default SearchWrapper
