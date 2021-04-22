import MapContext from '../contexts/MapContext'
import MapProvider from '../contexts/MapProvider'
import { SearchProvider } from '../contexts/SearchContext'
import { SettingsProvider } from '../contexts/SettingsContext'
import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />
  const MapContextProvider = MapProvider(MapContext)

  return (
    <MapContextProvider>
      <SearchProvider>
        <SettingsProvider>{layout}</SettingsProvider>
      </SearchProvider>
    </MapContextProvider>
  )
}

export default MainPage
