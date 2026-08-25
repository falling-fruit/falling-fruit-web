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
  const { locationId, position: positionInRedux } = useSelector(
    (state) => state.location,
  )
  const locationIdNullInRedux = locationId === null

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
      if (locationIdNullInRedux) {
        dispatch(initNewLocation(positionInRedux || view.center))
      }
    } else {
      // Should only happen for an artificially constructed URL
      history.push('/map')
    }
  }, []) //eslint-disable-line
  return null
}

export default ConnectNewLocation
