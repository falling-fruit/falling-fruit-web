import { createContext, useContext, useState } from 'react'

/**
 * Default filter selections.
 * @constant {Object}
 * @property {boolean} showLabels - Determines if labels appear under locations
 */
const DEFAULT_SETTINGS = {
  showLabels: true,
}

const SettingsContext = createContext()

const SettingsProvider = ({ children, ...props }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  return (
    <SettingsContext.Provider value={{ settings, setSettings }} {...props}>
      {children}
    </SettingsContext.Provider>
  )
}

const useSettings = () => useContext(SettingsContext)

export { SettingsProvider }
export { useSettings }
