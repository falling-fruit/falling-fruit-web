import { useState } from 'react'

import { DEFAULT_FILTERS } from '../contexts/SearchContext'

const SearchProvider = (SearchContext) => {
  const SearchContextProvider = ({ children, ...props }) => {
    const [viewport, setViewport] = useState(null)
    const [filters, setFilters] = useState(DEFAULT_FILTERS)
    return (
      <SearchContext.Provider
        value={{ viewport, setViewport, filters, setFilters }}
        {...props}
      >
        {children}
      </SearchContext.Provider>
    )
  }
  return SearchContextProvider
}

export default SearchProvider
