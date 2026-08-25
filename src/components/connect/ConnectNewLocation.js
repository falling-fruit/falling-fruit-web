import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { initNewLocation } from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { viewFromCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectNewLocation = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()
  const isDesktop = useIsDesktop()
  const { initialView } = useSelector((state) => state.map)
  const { locationId, position: existingPosition } = useSelector(
    (state) => state.location,
  )

  const hasInitialView = !!initialView
  useEffect(() => {
    const view = viewFromCurrentUrl()

    if (view) {
      if (!hasInitialView) {
        dispatch(
          setInitialView({
            center: view.center,
            zoom: Math.max(view.zoom, isDesktop ? 0 : 16),
          }),
        )
      }
      if (locationId !== 'new') {
        // On mobile, preserve the position from the draggable marker if already set
        const positionToUse =
          !isDesktop && existingPosition ? existingPosition : view.center
        dispatch(initNewLocation(positionToUse))
      }
    } else {
      // Should only happen for an artificially constructed URL
      history.push('/map')
    }
  }, []) //eslint-disable-line
  return null
}

export default ConnectNewLocation
