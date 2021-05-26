import { MapProvider } from '../contexts/MapContext'
import { SearchProvider } from '../contexts/SearchContext'
import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />

  return (
    <MapProvider>
      <SearchProvider>{layout}</SearchProvider>
    </MapProvider>
  )
}

export default MainPage
