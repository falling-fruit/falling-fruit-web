import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />

  return layout
}

export default MainPage
