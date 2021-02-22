import { DesktopBreakpoint, MobileBreakpoint } from './Breakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'

const MainPage = () => (
  <>
    <DesktopBreakpoint>
      <DesktopLayout />
    </DesktopBreakpoint>
    <MobileBreakpoint>
      <MobileLayout />
    </MobileBreakpoint>
  </>
)

export default MainPage
