import { useWindowSize } from '@reach/window-size'

/**
 * @constant {number}
 * Max width in pixels for which the mobile layout should be displayed
 */
const MOBILE_MAX_WIDTH = 767

/**
 * Renders its children if current window size is within [minWidth, maxWidth].
 */
const Breakpoint = ({ minWidth = 0, maxWidth = Infinity, children }) => {
  const { width } = useWindowSize()
  return width >= minWidth && width <= maxWidth ? children : null
}

export const DesktopBreakpoint = ({ children }) =>
  Breakpoint({ minWidth: MOBILE_MAX_WIDTH + 1, children })

export const MobileBreakpoint = ({ children }) =>
  Breakpoint({ maxWidth: MOBILE_MAX_WIDTH, children })
