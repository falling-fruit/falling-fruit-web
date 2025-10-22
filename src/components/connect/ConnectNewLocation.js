import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { initNewLocation, updatePosition } from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { viewFromCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectNewLocation = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()
  const isDesktop = useIsDesktop()
  const { initialView } = useSelector((state) => state.map)
  const { locationId } = useSelector((state) => state.location)

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
        dispatch(initNewLocation(view.center))
      } else if (!isDesktop) {
        dispatch(updatePosition(view.center))
      }
    } else {
      // Should only happen for an artificially constructed URL
      history.push('/map')
    }
  }, [dispatch, locationId, hasInitialView, isDesktop]) //eslint-disable-line
  return null
}

export default ConnectNewLocation
