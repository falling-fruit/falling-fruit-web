import { useIsDesktop } from '../utils/breakpointHooks'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => {
  const isDesktop = useIsDesktop()
  return isDesktop ? <DesktopLayout /> : <MobileLayout />
}

export default MainPage
