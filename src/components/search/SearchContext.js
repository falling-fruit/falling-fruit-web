import { createContext } from 'react'

/**
 * Default filter selections.
 * @constant {Object}
 * @property {number} muni - Whether to include Locations imported from municipal tree inventories
 * @property {number} invasive - Whether to include types flagged as invasive species
 * @property {number[]} types - Array of type IDs to filter on
 */
const DEFAULT_FILTERS = {
  muni: 0,
  invasive: 0,
  types: [],
}

const SearchContext = createContext()

export default SearchContext
export { DEFAULT_FILTERS }
