import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  FETCH_RADIUS_METRES,
  METRES_PER_LAT_DEG,
} from '../../constants/panorama'
import { updatePosition } from '../../redux/locationSlice'
import {
  closeStreetView,
  fetchPanoramaLocations,
  openStreetView,
  setPanoramaCenter,
  setPanoramaReady,
} from '../../redux/panoramaSlice'
import { fetchLocations } from '../../redux/viewChange'
import throttle from '../../utils/throttle'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

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
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  const {
    googleMap,
    getGoogleMaps,
    locations: mapLocations,
  } = useSelector((state) => state.map)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null
  const panoramaLocations = useSelector((state) => state.panorama.locations)
  const streetViewOpen = useSelector((state) => state.panorama.streetViewOpen)

  const {
    location: selectedLocation,
    position: editingPosition,
    isBeingEdited,
    locationId,
  } = useSelector((state) => state.location)
  const isAdding = locationId === 'new'
  const isAddingPositionMobile = !isDesktop && isAdding
  const isViewingLocation = locationId !== null && !isBeingEdited && !isAdding

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

  const isAddingPositionMobileRef = useRef(isAddingPositionMobile)
  isAddingPositionMobileRef.current = isAddingPositionMobile

  const editingPositionRef = useRef(editingPosition)
  editingPositionRef.current = editingPosition

  const visibleListenerRef = useRef(null)
  const positionListenerRef = useRef(null)
  const lastFetchedBoundsRef = useRef(null)
  const needsInitialOrientRef = useRef(false)

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
          needsInitialOrientRef.current = true

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
            needsInitialOrientRef.current = false
          }
          dispatch(openStreetView())

          if (isAddingPositionMobileRef.current) {
            dispatch(updatePosition(googleMap.getCenter().toJSON()))
          }

          waitForProjectionReady(googleMaps, panorama, () => {
            dispatch(setPanoramaReady(true))

            // Workaround: jiggle POV back and forth to force markers to render on first panorama load
            setTimeout(() => {
              const pov = panorama.getPov()
              panorama.setPov({ ...pov, heading: pov.heading + 0.01 })
              setTimeout(() => {
                panorama.setPov(pov)
              }, 50)
            }, 100)
          })
        } else {
          needsInitialOrientRef.current = false
          if (isAddingPositionMobileRef.current && editingPositionRef.current) {
            googleMap.setCenter(editingPositionRef.current)
          }
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

      if (needsInitialOrientRef.current) {
        needsInitialOrientRef.current = false
        dispatch(setPanoramaCenter(newCenter))
        lastFetchedBoundsRef.current = computeFetchBounds(newCenter)
        dispatch(fetchPanoramaLocations())
        orientPanoramaTowardsTarget(
          panorama,
          googleMaps,
          pos,
          targetRef.current,
        )
        return
      }

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

  useEffect(() => {
    if (!googleMap || !googleMaps || !streetViewOpen || !isViewingLocation) {
      return
    }

    const panorama = googleMap.getStreetView()
    if (!panorama) {
      return
    }

    // Use pointer events on the DOM container to detect taps reliably on
    // mobile (Google Maps' 'click' event doesn't fire on touch in Firefox).
    const container = panorama.getContainer?.() || googleMap.getDiv()

    let pointerStart = null

    const handlePointerDown = (e) => {
      pointerStart = { x: e.clientX, y: e.clientY, time: Date.now() }
    }

    const handlePointerUp = (e) => {
      if (!pointerStart) {
        return
      }

      const dx = e.clientX - pointerStart.x
      const dy = e.clientY - pointerStart.y
      const dt = Date.now() - pointerStart.time
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 10 && dt < 300) {
        history.push('/map?pane=&tab=')
      }

      pointerStart = null
    }

    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointerup', handlePointerUp)

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointerup', handlePointerUp)
    }
  }, [googleMap, googleMaps, streetViewOpen, isViewingLocation, history])

  return null
}

export default PanoramaEvents
