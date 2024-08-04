import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearLocation } from '../../redux/locationSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const DisconnectLocation = () => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const { locationId } = useSelector((state) => state.location)

  useEffect(() => {
    // on mobile, we offer viewing the list when editing position or viewing panorama
    // so we don't reset editing position for someone who tries to do it
    // - instead, the Map button takes them to those pages
    // we only want to drop the new location pin from map view
    if (isDesktop || locationId === 'new') {
      dispatch(clearLocation())
    }
  }, [dispatch]) //eslint-disable-line

  return null
}

export default DisconnectLocation
