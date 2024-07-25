import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { clearLocation } from '../../redux/locationSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const DisconnectLocation = () => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    // on mobile, we offer viewing the list when editing position or viewing panorama
    // so we don't reset editing position for someone who tries to do it
    //  instead, the Map button takes them to those pages
    if (isDesktop) {
      dispatch(clearLocation())
    }
  }, [dispatch]) //eslint-disable-line

  return null
}

export default DisconnectLocation
