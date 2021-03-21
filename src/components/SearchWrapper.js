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
  const [treeSelectData, setTreeSelectData] = useState([])
  const [filterCount, setFilterCount] = useState(null)

  return (
    <>
      <SearchBarContainer>
        <Search
          filterPressed={filterPressed}
          setFilterPressed={setFilterPressed}
          filterButton={
            <IconButton
              size={45}
              raised={false}
              pressed={filterPressed}
              icon={
                <FilterIcon
                  color={filterPressed ? theme.orange : theme.secondaryText}
                />
              }
              onClick={() =>
                setFilterPressed((filterPressed) => !filterPressed)
              }
              label="filter-button"
              filterCount={filterCount}
            />
          }
        />
      </SearchBarContainer>
      <Filter
        isOpen={filterPressed}
        treeSelectData={treeSelectData}
        setTreeSelectData={setTreeSelectData}
        setFilterCount={setFilterCount}
      />
    </>
  )
}

export default SearchWrapper
