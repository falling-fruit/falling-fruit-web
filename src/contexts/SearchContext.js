import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

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
  const { i18n } = useTranslation()

  useEffect(() => {
    const preloadTypes = async () => {
      // Preload type data
      const types = await getTypes()

      const newTypesById = {}
      for (const type of types) {
        newTypesById[type.id] = type
      }

      setTypesById(newTypesById)
    }

    preloadTypes()
  }, [setTypesById])

  // TODO: Is this the right approach for simplifying access to localized common name

  const getTypeNames = useCallback(
    (id) =>
      typesById[id].common_names[
        i18n.language === 'en-US' ? 'en' : i18n.language
      ],
    [typesById, i18n.language],
  )

  const getTypeName = (id) => getTypeNames(id)?.[0]

  return (
    <SearchContext.Provider
      value={{
        viewport,
        setViewport,
        filters,
        setFilters,
        typesById,
        getTypeName,
        getTypeNames,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

const useSearch = () => useContext(SearchContext)

export { SearchProvider, useSearch }
