import { useWindowSize } from '@reach/window-size'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { MOBILE_MAX_WIDTH } from '../components/ui/GlobalStyle'
import { layoutChange } from '../redux/miscSlice'

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

const ConnectedBreakpoint = () => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    dispatch(layoutChange({ isDesktop }))
  }, [isDesktop, dispatch])

  return null
}

export { ConnectedBreakpoint, useBreakpoint, useIsDesktop, useIsMobile }
