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
  const { initialView, googleMap } = useSelector((state) => state.map)
  const { pathname } = useLocation()
  const hasInitialView = !!initialView
  const parsedUrl = parseCurrentUrl()
  const view = parsedUrl.view || {
    center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
    zoom: DEFAULT_ZOOM,
  }

  useEffect(() => {
    if (!hasInitialView) {
      dispatch(setInitialView(view))
    }
  }, [dispatch, hasInitialView]) //eslint-disable-line

  useEffect(() => {
    if (hasInitialView && googleMap) {
      const currentCenter = googleMap.getCenter()
      const currentZoom = googleMap.getZoom()

      if (
        Math.abs(currentCenter.lat(), view.center.lat) > 1e-7 ||
        Math.abs(currentCenter.lng(), view.center.lng) > 1e-7
      ) {
        googleMap.setCenter(view.center)
      }

      if (currentZoom !== view.zoom) {
        googleMap.setZoom(view.zoom)
      }
    }
  }, [pathname]) //eslint-disable-line

  return null
}

export default ConnectMap
