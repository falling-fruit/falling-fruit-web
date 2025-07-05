import { useWindowSize } from '@reach/window-size'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

const getIsEmbed = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const isEmbedParam = urlParams.get('embed') === 'true'
    const isEmbedPath = window.location.pathname.startsWith('/locations/embed')
    return isEmbedParam || isEmbedPath
  }
  return false
}

const useIsEmbed = () => {
  const embedFromRedux = useSelector((state) => state.misc.isEmbed)
  const [isEmbed, _setIsEmbed] = useState(() => {
    if (embedFromRedux !== null) {
      return embedFromRedux
    }
    return getIsEmbed()
  })
  return isEmbed
}

const useIsMobile = () => {
  const isEmbed = useIsEmbed()
  const isMobileWidth = useBreakpoint({ maxWidth: MOBILE_MAX_WIDTH })
  return isEmbed || isMobileWidth
}

const useIsDesktop = () => {
  const isEmbed = useIsEmbed()
  const isDesktopWidth = useBreakpoint({ minWidth: MOBILE_MAX_WIDTH + 1 })
  return !isEmbed && isDesktopWidth
}

const ConnectedBreakpoint = () => {
  const dispatch = useDispatch()
  const isEmbed = useIsEmbed()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    dispatch(layoutChange({ isDesktop, isEmbed }))
  }, [isDesktop, isEmbed, dispatch])

  return null
}

export {
  ConnectedBreakpoint,
  useBreakpoint,
  useIsDesktop,
  useIsEmbed,
  useIsMobile,
}
