import MapContext from '../contexts/MapContext'
import MapProvider from '../contexts/MapProvider'
import SearchContext from '../contexts/SearchContext'
import SearchProvider from '../contexts/SearchProvider'
import SettingsContext from '../contexts/SettingsContext'
import SettingsProvider from '../contexts/SettingsProvider'
import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />
  const MapContextProvider = MapProvider(MapContext)
  const SearchContextProvider = SearchProvider(SearchContext)
  const SettingsContextProvider = SettingsProvider(SettingsContext)

  return (
    <MapContextProvider>
      <SearchContextProvider>
        <SettingsContextProvider>{layout}</SettingsContextProvider>
      </SearchContextProvider>
    </MapContextProvider>
  )
}

export default MainPage
