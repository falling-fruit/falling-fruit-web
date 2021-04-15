import { createContext } from 'react'

/**
 * Default filter selections.
 * @constant {Object}
 * @property {boolean} showLabels - Determines if labels appear under locations
 */
const DEFAULT_SETTINGS = {
  showLabels: true,
}

const SettingsContext = createContext()

export default SettingsContext
export { DEFAULT_SETTINGS }
