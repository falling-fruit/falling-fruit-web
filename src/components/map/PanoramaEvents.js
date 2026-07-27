import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  FETCH_RADIUS_METRES,
  METRES_PER_LAT_DEG,
} from '../../constants/panorama'
import {
  closeStreetView,
  fetchPanoramaLocations,
  openStreetView,
  setPanoramaCenter,
  setPanoramaReady,
} from '../../redux/panoramaSlice'
import { fetchLocations } from '../../redux/viewChange'
import throttle from '../../utils/throttle'

const METRES_100_IN_LAT_DEG = 100 / METRES_PER_LAT_DEG

const metres100InLngDeg = (lat) =>
  100 / (METRES_PER_LAT_DEG * Math.cos((lat * Math.PI) / 180))

const centerIsWithinSafeBounds = (center, bounds) => {
  if (!bounds) {
    return false
  }
  const latMargin = METRES_100_IN_LAT_DEG
  const lngMargin = metres100InLngDeg(center.lat)

  return (
    center.lat >= bounds.south + latMargin &&
    center.lat <= bounds.north - latMargin &&
    center.lng >= bounds.west + lngMargin &&
    center.lng <= bounds.east - lngMargin
  )
}

const orientPanoramaTowardsTarget = (
  panorama,
  googleMaps,
  position,
  target,
) => {
  if (!target || !googleMaps.geometry) {
    return
  }
  const panoLatLng = new googleMaps.LatLng(position.lat(), position.lng())
  const targetLatLng = new googleMaps.LatLng(target.lat, target.lng)
  const heading = googleMaps.geometry.spherical.computeHeading(
    panoLatLng,
    targetLatLng,
  )
  panorama.setPov({ heading, pitch: 0 })
}

const waitForProjectionReady = (googleMaps, panorama, onReady) => {
  const readyOverlay = new googleMaps.OverlayView()
  readyOverlay.onAdd = () => void 0
  readyOverlay.draw = () => void 0
  readyOverlay.onRemove = () => void 0
  readyOverlay.setMap(panorama)

  const markReady = () => {
    readyOverlay.setMap(null)
    onReady()
  }

  if (readyOverlay.getProjection()) {
    markReady()
  } else {
    googleMaps.event.addListenerOnce(panorama, 'projection_changed', markReady)
  }
}

const computeFetchBounds = (center) => {
  const latDelta = FETCH_RADIUS_METRES / METRES_PER_LAT_DEG
  const lngDelta =
    FETCH_RADIUS_METRES /
    (METRES_PER_LAT_DEG * Math.cos((center.lat * Math.PI) / 180))

  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lng + lngDelta,
    west: center.lng - lngDelta,
  }
}

const PanoramaEvents = () => {
  const dispatch = useDispatch()

  const {
    googleMap,
    getGoogleMaps,
    locations: mapLocations,
  } = useSelector((state) => state.map)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null
  const panoramaLocations = useSelector((state) => state.panorama.locations)

  const {
    location: selectedLocation,
    position: editingPosition,
    isBeingEdited,
    locationId,
  } = useSelector((state) => state.location)

  let targetLatLng = null
  if ((isBeingEdited || locationId === 'new') && editingPosition) {
    targetLatLng = editingPosition
  } else if (selectedLocation) {
    targetLatLng = { lat: selectedLocation.lat, lng: selectedLocation.lng }
  } else if (locationId && locationId !== 'new') {
    const found =
      mapLocations.find((loc) => loc.id === locationId) ||
      panoramaLocations.find((loc) => loc.id === locationId)
    if (found) {
      targetLatLng = { lat: found.lat, lng: found.lng }
    }
  }
  const targetRef = useRef(targetLatLng)
  targetRef.current = targetLatLng

  const visibleListenerRef = useRef(null)
  const positionListenerRef = useRef(null)
  const lastFetchedBoundsRef = useRef(null)

  useEffect(() => {
    if (!googleMap || !googleMaps) {
      return
    }

    const panorama = googleMap.getStreetView()

    visibleListenerRef.current = googleMaps.event.addListener(
      panorama,
      'visible_changed',
      () => {
        if (panorama.getVisible()) {
          const pos = panorama.getPosition()
          if (pos) {
            const center = { lat: pos.lat(), lng: pos.lng() }
            dispatch(setPanoramaCenter(center))
            lastFetchedBoundsRef.current = null
            dispatch(fetchPanoramaLocations())

            orientPanoramaTowardsTarget(
              panorama,
              googleMaps,
              pos,
              targetRef.current,
            )
          }
          dispatch(openStreetView())

          waitForProjectionReady(googleMaps, panorama, () => {
            dispatch(setPanoramaReady(true))
          })
        } else {
          dispatch(closeStreetView())
          dispatch(setPanoramaCenter(null))
          dispatch(setPanoramaReady(false))
          lastFetchedBoundsRef.current = null
          dispatch(fetchLocations())
        }
      },
    )

    const handlePositionChanged = throttle(() => {
      const pos = panorama.getPosition()
      if (!pos) {
        return
      }
      const newCenter = { lat: pos.lat(), lng: pos.lng() }

      dispatch(setPanoramaCenter(newCenter))

      if (!centerIsWithinSafeBounds(newCenter, lastFetchedBoundsRef.current)) {
        lastFetchedBoundsRef.current = computeFetchBounds(newCenter)
        dispatch(fetchPanoramaLocations())
      }
    }, 1000)

    positionListenerRef.current = googleMaps.event.addListener(
      panorama,
      'position_changed',
      handlePositionChanged,
    )

    return () => {
      if (visibleListenerRef.current) {
        googleMaps.event.removeListener(visibleListenerRef.current)
        visibleListenerRef.current = null
      }
      if (positionListenerRef.current) {
        googleMaps.event.removeListener(positionListenerRef.current)
        positionListenerRef.current = null
      }
    }
  }, [googleMap, googleMaps, dispatch])

  return null
}

export default PanoramaEvents
