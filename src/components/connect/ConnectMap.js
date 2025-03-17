import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setInitialView } from '../../redux/mapSlice'
import { parseCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'

const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 4

const ConnectMap = () => {
  const dispatch = useDispatch()
  const { googleMap, initialView } = useSelector((state) => state.map)
  const { lastMapView } = useSelector((state) => state.viewport)
  const hasInitialView = !!initialView
  const history = useAppHistory()
  const parsedUrl = parseCurrentUrl()
  const view = parsedUrl.view ||
    lastMapView || {
      center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
      zoom: DEFAULT_ZOOM,
    }

  useEffect(() => {
    if (!hasInitialView) {
      dispatch(setInitialView(view))
    }
  }, [dispatch, hasInitialView]) //eslint-disable-line

  useEffect(() => {
    if (hasInitialView && !parsedUrl.view) {
      history.replaceView({
        center: googleMap.getCenter().toJSON(),
        zoom: googleMap.getZoom(),
      })
    }
  }, [dispatch, hasInitialView, !!parsedUrl.view]) //eslint-disable-line

  return null
}

export default ConnectMap
