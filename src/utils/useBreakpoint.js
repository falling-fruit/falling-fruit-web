import { useWindowSize } from '@reach/window-size'

import { MOBILE_MAX_WIDTH } from '../components/ui/GlobalStyle'

/**
 * Hook that returns whether current window size is within [minWidth, maxWidth]
 * and [minHeight, maxHeight].
 */
const useBreakpoint = ({
  minWidth = 0,
  maxWidth = Infinity,
  minHeight = 0,
  maxHeight = Infinity,
}) => {
  const { width, height } = useWindowSize()
  return (
    width >= minWidth &&
    width <= maxWidth &&
    height >= minHeight &&
    height <= maxHeight
  )
}

const useIsMobile = () => useBreakpoint({ maxWidth: MOBILE_MAX_WIDTH })

const useIsDesktop = () => useBreakpoint({ minWidth: MOBILE_MAX_WIDTH + 1 })

export { useBreakpoint, useIsDesktop, useIsMobile }
