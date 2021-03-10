import { useState } from 'react'

import { useIsDesktop } from '../utils/useBreakpoint'
import DesktopLayout from './desktop/DesktopLayout'
import MobileLayout from './mobile/MobileLayout'
import SearchContext from './search/SearchContext'

const MainPage = () => {
  const [viewport, setViewport] = useState(null)

  const isDesktop = useIsDesktop()
  const layout = isDesktop ? <DesktopLayout /> : <MobileLayout />

  return (
    <SearchContext.Provider value={{ viewport, setViewport }}>
      {layout}
    </SearchContext.Provider>
  )
}

export default MainPage
