import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setView } from '../../redux/mapSlice'
import { parseCurrentUrl } from '../../utils/appUrl'

const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 1

const ConnectView = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    const { view } = parseCurrentUrl()
    dispatch(
      setView(
        view || {
          center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
          zoom: DEFAULT_ZOOM,
        },
      ),
    )
  }, [dispatch, location.pathname])

  return null
}

export default ConnectView
