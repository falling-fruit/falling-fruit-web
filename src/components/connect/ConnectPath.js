import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { viewFromCurrentUrl } from '../../utils/appUrl'

const ConnectPath = () => {
  const { initialView, googleMap } = useSelector((state) => state.map)
  const { pathname } = useLocation()
  const hasInitialView = !!initialView
  const view = viewFromCurrentUrl()
  const [isMapIdle, setIsMapIdle] = useState(true)

  useEffect(() => {
    if (!googleMap) {
      return
    }

    const idleListener = googleMap.addListener('idle', () => {
      setIsMapIdle(true)
    })

    const dragStartListener = googleMap.addListener('dragstart', () => {
      setIsMapIdle(false)
    })

    const zoomChangedListener = googleMap.addListener('zoom_changed', () => {
      setIsMapIdle(false)
    })

    return () => {
      idleListener.remove()
      dragStartListener.remove()
      zoomChangedListener.remove()
    }
  }, [googleMap])

  useEffect(() => {
    if (hasInitialView && googleMap && view && isMapIdle) {
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
  }, [pathname, hasInitialView, googleMap]) //eslint-disable-line

  return null
}

export default ConnectPath
