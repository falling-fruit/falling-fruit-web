import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setView } from '../../redux/mapSlice'
import { parseCurrentUrl } from '../../utils/appUrl'

const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 4

const ConnectView = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const viewRedux = useSelector((state) => state.map.view)

  useEffect(() => {
    if (!viewRedux) {
      const { view } = parseCurrentUrl()
      dispatch(
        setView(
          view || {
            center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
            zoom: DEFAULT_ZOOM,
          },
        ),
      )
    }
  }, [dispatch, location.pathname]) //eslint-disable-line

  return null
}

export default ConnectView
