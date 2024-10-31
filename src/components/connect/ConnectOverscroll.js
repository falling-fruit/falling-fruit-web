import { useEffect } from 'react'

import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectOverscroll = () => {
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (!isDesktop) {
      document.body.style.overscrollBehaviorY = 'contain'
      return () => {
        document.body.style.overscrollBehaviorY = ''
      }
    }
  }, [isDesktop])

  return null
}

export default ConnectOverscroll
