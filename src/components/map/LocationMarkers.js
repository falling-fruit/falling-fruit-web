import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { MapType } from '../../constants/settings'
import { createLocationDotMarker } from './createDotMarker'

const PANORAMA_LABEL_RADIUS_METRES = 100
const approxDistanceMetres = (lat1, lng1, lat2, lng2) => {
  const R = 6_371_000 // Earth radius in metres
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const avgLat = ((lat1 + lat2) / 2) * (Math.PI / 180)
  const x = dLng * Math.cos(avgLat)
  return R * Math.sqrt(dLat * dLat + x * x)
}

const LocationMarkers = ({
  locations,
  googleMap,
  getGoogleMaps,
  onLocationClick,
  showLabels,
}) => {
  const markersRef = useRef(new Map())
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const { types: selectedTypes } = useSelector((state) => state.filter)
  const { mapType } = useSelector((state) => state.settings)
  const invertColors = mapType === MapType.Hybrid
  const panoramaReady = useSelector((state) => state.panorama.panoramaReady)
  const panoramaCenter = useSelector((state) => state.panorama.panoramaCenter)

  const onLocationClickRef = useRef(onLocationClick)
  useEffect(() => {
    onLocationClickRef.current = onLocationClick
  }, [onLocationClick])

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return
    }

    const google = getGoogleMaps()
    const currentMarkers = markersRef.current

    const mapTarget =
      panoramaReady && googleMap ? googleMap.getStreetView() : googleMap

    if (!mapTarget) {
      return
    }

    const shouldShowLabel = (location) => {
      if (!showLabels) {
        return false
      }
      if (panoramaReady) {
        if (!panoramaCenter) {
          return false
        }
        const dist = approxDistanceMetres(
          panoramaCenter.lat,
          panoramaCenter.lng,
          location.lat,
          location.lng,
        )
        return dist <= PANORAMA_LABEL_RADIUS_METRES
      }
      return true
    }

    const newLocationIds = new Set(locations.map((loc) => loc.id))
    const existingLocationIds = new Set(currentMarkers.keys())

    existingLocationIds.forEach((locationId) => {
      if (!newLocationIds.has(locationId)) {
        const marker = currentMarkers.get(locationId)
        if (marker) {
          marker.detachHoverListeners()
          marker.removeLabel()
          marker.setMap(null)
          google.event.clearInstanceListeners(marker)
          currentMarkers.delete(locationId)
        }
      }
    })

    currentMarkers.forEach((marker) => {
      if (marker.getMap() !== mapTarget) {
        marker.setMap(mapTarget)
        if (marker._label) {
          marker._label.setMap(mapTarget)
        }
      }
    })

    const locationsNeedingNewMarkers = locations.filter(
      (loc) => !existingLocationIds.has(loc.id),
    )
    const locationsNeedingUpdate = locations.filter((loc) =>
      existingLocationIds.has(loc.id),
    )

    locationsNeedingUpdate.forEach((location) => {
      const marker = currentMarkers.get(location.id)
      const prevLocation = marker._location

      if (
        prevLocation.lat !== location.lat ||
        prevLocation.lng !== location.lng
      ) {
        marker.updatePosition(location.lat, location.lng)
      }

      if (marker._isSaved !== Boolean(location.in_list)) {
        marker.updateSavedState(Boolean(location.in_list))
      }
    })

    const createNewMarkers = () => {
      locationsNeedingNewMarkers.forEach((location) => {
        const marker = createLocationDotMarker(google, mapTarget, location, {
          optimized: locations.length > 100,
        })

        google.event.addListener(marker, 'click', (event) => {
          event.stop()
          onLocationClickRef.current?.(location)
        })

        currentMarkers.set(location.id, marker)
      })
    }

    const overlay = new google.OverlayView()
    overlay.onAdd = () => void 0
    overlay.draw = () => void 0
    overlay.onRemove = () => void 0
    overlay.setMap(mapTarget)

    if (overlay.getProjection()) {
      overlay.setMap(null)
      createNewMarkers()
    } else {
      const listener = google.event.addListenerOnce(
        mapTarget,
        'projection_changed',
        () => {
          overlay.setMap(null)
          createNewMarkers()
        },
      )
      return () => {
        google.event.removeListener(listener)
        overlay.setMap(null)
      }
    }

    currentMarkers.forEach((marker) => {
      const effectiveShowLabel = shouldShowLabel(marker._location)
      marker.syncLabel(
        typesAccess,
        selectedTypes,
        effectiveShowLabel,
        invertColors,
      )
    })
  }, [
    locations,
    googleMap,
    getGoogleMaps,
    typesAccess,
    selectedTypes,
    showLabels,
    invertColors,
    panoramaReady,
    panoramaCenter,
  ])

  useEffect(
    () => () => {
      const google = getGoogleMaps?.()
      if (!google) {
        return
      }

      markersRef.current.forEach((marker) => {
        marker.detachHoverListeners()
        marker.removeLabel()
        marker.setMap(null)
        google.event.clearInstanceListeners(marker)
      })

      markersRef.current.clear()
    },
    [getGoogleMaps],
  )

  return null
}

export default LocationMarkers
