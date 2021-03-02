import { useWindowSize } from '@reach/window-size'

/**
 * @constant {number}
 * Max width in pixels for which the mobile layout should be displayed
 */
const MOBILE_MAX_WIDTH = 767

/**
 * Hook that returns whether current window size is within [minWidth, maxWidth]
 * and [minHeight, maxHeight].
 */
export const useBreakpoint = ({
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

export const useIsDesktop = () =>
  useBreakpoint({ minWidth: MOBILE_MAX_WIDTH + 1 })

export const useIsMobile = () => useBreakpoint({ maxWidth: MOBILE_MAX_WIDTH })
