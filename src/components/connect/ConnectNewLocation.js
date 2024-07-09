import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { initNewLocation } from '../../redux/locationSlice'
import { setView } from '../../redux/mapSlice'
import { getViewCoordsFromUrl } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectNewLocation = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    const [isValid, { center, zoom: currentZoom }] = getViewCoordsFromUrl()
    if (isValid) {
      dispatch(
        setView({ center, zoom: Math.max(currentZoom, isDesktop ? 0 : 16) }),
      )
      dispatch(initNewLocation(center))
    } else {
      toast.error(`Could not initialize new location at: ${location.pathname}`)
      history.push('/map')
    }
  }, [dispatch, location.pathname]) //eslint-disable-line

  return null
}

export default ConnectNewLocation
