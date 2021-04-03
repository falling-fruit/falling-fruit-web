import React, { useState } from 'react'

import Filter from './filter/Filter'
import FilterIconButton from './filter/FilterIconButton'
import Search from './search/Search'

const SearchWrapper = () => {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      <Search
        onType={() => setFilterOpen(false)}
        sideButton={
          <FilterIconButton pressed={filterOpen} setPressed={setFilterOpen} />
        }
      />
      <Filter isOpen={filterOpen} />
    </>
  )
}

export default SearchWrapper
