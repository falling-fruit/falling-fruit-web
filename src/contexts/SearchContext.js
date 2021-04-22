import { createContext, useContext, useState } from 'react'

/**
 * Default filter selections.
 * @constant {Object}
 * @property {number} muni - Whether to include Locations imported from municipal tree inventories
 * @property {number} invasive - Whether to include types flagged as invasive species
 * @property {number[]} types - Array of type IDs to filter on
 */
const DEFAULT_FILTERS = {
  muni: true,
  invasive: false,
  types: [],
}

const SearchContext = createContext()

const SearchProvider = ({ children, ...props }) => {
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

const useSearch = () => useContext(SearchContext)

export { SearchProvider }
export { useSearch }
