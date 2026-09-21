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
    return null
  }
  const panoLatLng = new googleMaps.LatLng(position.lat(), position.lng())
  const targetLatLng = new googleMaps.LatLng(target.lat, target.lng)
  const heading = googleMaps.geometry.spherical.computeHeading(
    panoLatLng,
    targetLatLng,
  )
  panorama.setPov({ heading, pitch: 0 })
  return heading
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
  const desiredHeadingRef = useRef(null)

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
          desiredHeadingRef.current = null

          const pos = panorama.getPosition()
          if (pos) {
            const center = { lat: pos.lat(), lng: pos.lng() }
            dispatch(setPanoramaCenter(center))
            lastFetchedBoundsRef.current = null
            dispatch(fetchPanoramaLocations())

            const heading = orientPanoramaTowardsTarget(
              panorama,
              googleMaps,
              pos,
              targetRef.current,
            )
            if (heading !== null) {
              desiredHeadingRef.current = heading
            }
            needsInitialOrientRef.current = false
          }
          dispatch(openStreetView())

          if (isAddingPositionMobileRef.current) {
            dispatch(updatePosition(googleMap.getCenter().toJSON()))
          }

          waitForProjectionReady(googleMaps, panorama, () => {
            dispatch(setPanoramaReady(true))

            let targetHeading = desiredHeadingRef.current
            if (targetRef.current) {
              const readyPos = panorama.getPosition()
              if (readyPos) {
                const heading = orientPanoramaTowardsTarget(
                  panorama,
                  googleMaps,
                  readyPos,
                  targetRef.current,
                )
                if (heading !== null) {
                  targetHeading = heading
                  desiredHeadingRef.current = heading
                  needsInitialOrientRef.current = false
                }
              }
            }

            if (targetHeading !== null) {
              panorama.setPov({ heading: targetHeading, pitch: 0 })
            }

            // Workaround: jiggle POV back and forth to force markers to render on first panorama load
            setTimeout(() => {
              const pov = panorama.getPov()
              const basePov =
                targetHeading !== null
                  ? { ...pov, heading: targetHeading, pitch: 0 }
                  : pov
              panorama.setPov({ ...basePov, heading: basePov.heading + 0.01 })
              setTimeout(() => {
                panorama.setPov(basePov)
              }, 50)
            }, 100)
          })
        } else {
          needsInitialOrientRef.current = false
          desiredHeadingRef.current = null
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
        const heading = orientPanoramaTowardsTarget(
          panorama,
          googleMaps,
          pos,
          targetRef.current,
        )
        if (heading !== null) {
          desiredHeadingRef.current = heading
        }
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
    if (
      isDesktop ||
      !googleMap ||
      !googleMaps ||
      !streetViewOpen ||
      !isViewingLocation
    ) {
      return
    }

    const panorama = googleMap.getStreetView()
    if (!panorama) {
      return
    }

    // dismiss location drawer with a tap (extra code just for panorama)
    const container = panorama.getContainer?.() || googleMap.getDiv()

    let pointerStart = null
    // When a pointer sequence qualifies as a "dismiss drawer" tap, stop events so we don't also move
    let suppressUntil = 0

    const handlePointerDown = (e) => {
      pointerStart = { x: e.clientX, y: e.clientY, time: Date.now() }
    }

    const isDismissTap = (e) => {
      if (!pointerStart) {
        return false
      }

      const dx = e.clientX - pointerStart.x
      const dy = e.clientY - pointerStart.y
      const dt = Date.now() - pointerStart.time
      const distance = Math.sqrt(dx * dx + dy * dy)

      const isStreetViewControl = e.target.closest?.(
        '.gm-control-active, .gm-iv-back, .gm-iv-close, .gm-bundled-control, .gm-compass',
      )

      return !isStreetViewControl && distance < 10 && dt < 300
    }

    const handlePointerUpCapture = (e) => {
      if (!pointerStart) {
        return
      }

      if (isDismissTap(e)) {
        // Cancel this pointerup so Street View never navigates, and suppress the
        // follow-up mouseup/click that the browser synthesises from this gesture.
        e.stopPropagation()
        e.preventDefault()
        suppressUntil = Date.now() + 400
        history.push('/map?pane=&tab=')
      }

      pointerStart = null
    }

    const suppressSyntheticEvent = (e) => {
      if (Date.now() < suppressUntil) {
        e.stopPropagation()
        e.preventDefault()
      }
    }

    container.addEventListener('pointerdown', handlePointerDown)
    // Capture phase: intercept before Street View's inner handlers run.
    container.addEventListener('pointerup', handlePointerUpCapture, true)
    container.addEventListener('mouseup', suppressSyntheticEvent, true)
    container.addEventListener('click', suppressSyntheticEvent, true)

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointerup', handlePointerUpCapture, true)
      container.removeEventListener('mouseup', suppressSyntheticEvent, true)
      container.removeEventListener('click', suppressSyntheticEvent, true)
    }
  }, [
    isDesktop,
    googleMap,
    googleMaps,
    streetViewOpen,
    isViewingLocation,
    history,
  ])

  return null
}

export default PanoramaEvents
