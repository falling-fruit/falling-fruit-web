import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Filter from './filter/Filter'
import FilterIconButton from './filter/FilterIconButton'
import Search from './search/Search'

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SearchWrapper = () => {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      <SearchBarContainer>
        <Search
          onType={() => setFilterOpen(false)}
          sideButton={
            <FilterIconButton pressed={filterOpen} setPressed={setFilterOpen} />
          }
        />
      </SearchBarContainer>
      <Filter isOpen={filterOpen} />
    </>
  )
}

export default SearchWrapper
