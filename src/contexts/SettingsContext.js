import { createContext, useContext, useReducer } from 'react'

/**
 * Default filter selections.
 * @constant {Object}
 * @property {boolean} showLabels - Determines if labels appear under locations
 */
const DEFAULT_SETTINGS = {
  showLabels: false,
  showScientificNames: false,
  mapType: 'roadmap',
  mapLayers: [],
  overrideDataLanguage: false,
}

const SettingsContext = createContext()

const settingsReducer = (settings, partialSettings) => ({
  ...settings,
  ...partialSettings,
})

const SettingsProvider = ({ children }) => {
  const [settings, addSetting] = useReducer(settingsReducer, DEFAULT_SETTINGS)

  return (
    <SettingsContext.Provider value={{ settings, addSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

const useSettings = () => useContext(SettingsContext)

export { SettingsProvider, useSettings }
