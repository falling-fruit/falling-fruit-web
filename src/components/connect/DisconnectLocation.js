import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearLocation } from '../../redux/locationSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const DisconnectLocation = () => {
  const dispatch = useDispatch()
  const isBeingEdited = useSelector((state) => state.location.isBeingEdited)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    // on mobile, we offer viewing the list when editing position
    // don't reset editing position for someone who tries to do it
    if (isDesktop || !isBeingEdited) {
      dispatch(clearLocation())
    }
  }, [dispatch]) //eslint-disable-line

  return null
}

export default DisconnectLocation
