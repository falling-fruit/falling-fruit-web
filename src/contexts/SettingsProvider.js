import { useState } from 'react'

import { DEFAULT_SETTINGS } from '../contexts/SettingsContext'

const SettingsProvider = (SettingsContext) => {
  const SettingsProviderContext = ({ children, ...props }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    return (
      <SettingsContext.Provider value={{ settings, setSettings }} {...props}>
        {children}
      </SettingsContext.Provider>
    )
  }
  return SettingsProviderContext
}

export default SettingsProvider
