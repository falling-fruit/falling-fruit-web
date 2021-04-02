import { useState } from 'react'

import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MapContext, { DEFAULT_VIEW_STATE } from './map/MapContext'
import MobileLayout from './mobile/MobileLayout'
import SearchContext, { DEFAULT_FILTERS } from './search/SearchContext'

const MainPage = () => {
  // TODO: make a custom hook that stores state. Move all contexts into contexts folder
  const [view, setView] = useState(DEFAULT_VIEW_STATE)
  const [viewport, setViewport] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />

  return (
    <MapContext.Provider value={{ view, setView }}>
      <SearchContext.Provider
        value={{ viewport, setViewport, filters, setFilters }}
      >
        {layout}
      </SearchContext.Provider>
    </MapContext.Provider>
  )
}

export default MainPage
