import { useState } from 'react'

import MapContext from '../contexts/MapContext'
import MapProvider from '../contexts/MapProvider'
import SearchContext from '../contexts/SearchContext'
import SearchProvider from '../contexts/SearchProvider'
import SettingsContext, { DEFAULT_SETTINGS } from '../contexts/SettingsContext'
import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const [showLabels, setShowLabels] = useState(DEFAULT_SETTINGS.showLabels)

  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />
  const MapContextProvider = MapProvider(MapContext)
  const SearchContextProvider = SearchProvider(SearchContext)

  return (
    <MapContextProvider>
      <SearchContextProvider>
        <SettingsContext.Provider value={{ showLabels, setShowLabels }}>
          {layout}
        </SettingsContext.Provider>
      </SearchContextProvider>
    </MapContextProvider>
  )
}

export default MainPage
