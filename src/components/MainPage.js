import { MapProvider } from '../contexts/MapContext'
import { SearchProvider } from '../contexts/SearchContext'
import { SettingsProvider } from '../contexts/SettingsContext'
import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />

  return (
    <MapProvider>
      <SearchProvider>
        <SettingsProvider>{layout}</SettingsProvider>
      </SearchProvider>
    </MapProvider>
  )
}

export default MainPage
