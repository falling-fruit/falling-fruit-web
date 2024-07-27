import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setInitialView } from '../../redux/mapSlice'
import { parseCurrentUrl } from '../../utils/appUrl'

const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 4

const ConnectMap = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { initialView } = useSelector((state) => state.map)

  useEffect(() => {
    if (!initialView) {
      const { view } = parseCurrentUrl()
      dispatch(
        setInitialView(
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

export default ConnectMap
