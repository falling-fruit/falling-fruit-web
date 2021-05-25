import { createContext, useContext, useEffect, useState } from 'react'

import { getTypes } from '../utils/api'

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

const SearchProvider = ({ children }) => {
  const [viewport, setViewport] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [typesById, setTypesById] = useState()

  useEffect(() => {
    const preloadTypes = async () => {
      // Preload type data
      const types = await getTypes({
        swlat: -85,
        nelat: 85,
        swlng: -180,
        nelng: 180,
        zoom: 0,
        urls: 1,
        muni: 1,
      })

      const newTypesById = {}
      for (const type of types) {
        newTypesById[type.id] = type
      }

      setTypesById(newTypesById)
    }

    preloadTypes()
  }, [])

  return (
    <SearchContext.Provider
      value={{ viewport, setViewport, filters, setFilters, typesById }}
    >
      {children}
    </SearchContext.Provider>
  )
}

const useSearch = () => useContext(SearchContext)

export { SearchProvider, useSearch }
