import { useState } from 'react'

import MapContext from '../contexts/MapContext'
import MapProvider from '../contexts/MapProvider'
import SearchContext, { DEFAULT_FILTERS } from '../contexts/SearchContext'
import SettingsContext, { DEFAULT_SETTINGS } from '../contexts/SettingsContext'
import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  // const [view, setView] = useState(DEFAULT_VIEW_STATE)
  const [viewport, setViewport] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showLabels, setShowLabels] = useState(DEFAULT_SETTINGS.showLabels)

  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />
  const MapContextProvider = MapProvider(MapContext)

  return (
    <MapContextProvider>
      <SearchContext.Provider
        value={{ viewport, setViewport, filters, setFilters }}
      >
        <SettingsContext.Provider value={{ showLabels, setShowLabels }}>
          {layout}
        </SettingsContext.Provider>
      </SearchContext.Provider>
    </MapContextProvider>
  )
}

export default MainPage
