import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { initNewLocation } from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { parseCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectNewLocation = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useAppHistory()
  const isDesktop = useIsDesktop()
  const { initialView } = useSelector((state) => state.map)

  useEffect(() => {
    const { view } = parseCurrentUrl()

    if (view) {
      if (!initialView) {
        dispatch(
          setInitialView({
            center: view.center,
            zoom: Math.max(view.zoom, isDesktop ? 0 : 16),
          }),
        )
      }
      dispatch(initNewLocation(view.center))
    } else {
      toast.error(`Could not initialize new location at: ${location.pathname}`)
      history.push('/map')
    }
  }, [dispatch, location.pathname]) //eslint-disable-line

  return null
}

export default ConnectNewLocation
