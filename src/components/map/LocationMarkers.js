import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { getDisplayLabel } from '../../utils/getDisplayLabel'
import {
  createLabel,
  formatLabelHtml,
  getMarkerIcon,
  Z_INDEX,
} from './locationMarkerHelpers'

const LocationMarkers = ({
  locations,
  googleMap,
  getGoogleMaps,
  onLocationClick,
  showLabels,
}) => {
  const markersRef = useRef(new Map())
  const [hoveredLocationId, setHoveredLocationId] = useState(null)
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const { types: selectedTypes } = useSelector((state) => state.filter)
  const { mapType } = useSelector((state) => state.settings)
  const streetViewOpen = useSelector((state) => state.location.streetViewOpen)

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return
    }

    const google = getGoogleMaps()
    const currentMarkers = markersRef.current

    // While Street View is open, Google projects the map markers into the
    // panorama. Hide them all there; PanoramaHandler draws the dots and
    // fruit-name labels (and the selected "here" pin) for the panorama instead.
    const visibleLocations = streetViewOpen ? [] : locations

    const newLocationIds = new Set(visibleLocations.map((loc) => loc.id))
    const existingLocationIds = new Set(currentMarkers.keys())

    existingLocationIds.forEach((locationId) => {
      if (!newLocationIds.has(locationId)) {
        const markerData = currentMarkers.get(locationId)
        if (markerData) {
          markerData.marker.setMap(null)
          if (markerData.label) {
            markerData.label.setMap(null)
          }
          google.event.clearInstanceListeners(markerData.marker)
          currentMarkers.delete(locationId)
        }
      }
    })

    visibleLocations.forEach((location) => {
      const isSaved = Boolean(location.in_list)

      if (!existingLocationIds.has(location.id)) {
        const labelData = (location.type_ids || [])
          .map((id) => getDisplayLabel(typesAccess, id))
          .filter(Boolean)

        const marker = new google.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: googleMap,
          optimized: visibleLocations.length > 100,
          icon: getMarkerIcon(google, isSaved),
          zIndex: isSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT,
        })

        google.event.addListener(marker, 'mouseover', () => {
          setHoveredLocationId(location.id)
        })

        google.event.addListener(marker, 'mouseout', () => {
          setHoveredLocationId(null)
        })

        if (onLocationClick) {
          google.event.addListener(marker, 'click', (event) => {
            event.stop()
            onLocationClick(location)
          })
        }

        currentMarkers.set(location.id, {
          marker,
          label: null,
          labelData,
          location,
          isSaved,
        })
      } else {
        const markerData = currentMarkers.get(location.id)
        const prevLocation = markerData.location
        if (
          prevLocation.lat !== location.lat ||
          prevLocation.lng !== location.lng
        ) {
          markerData.marker.setPosition({
            lat: location.lat,
            lng: location.lng,
          })
          if (markerData.label) {
            markerData.label.updatePosition(google, location.lat, location.lng)
          }
          markerData.location = location
        }

        // Update marker icon and zIndex if saved state changed
        if (markerData.isSaved !== isSaved) {
          markerData.marker.setIcon(getMarkerIcon(google, isSaved))
          markerData.marker.setZIndex(isSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT)
          markerData.isSaved = isSaved
          // Update label z-index if it exists
          if (markerData.label && markerData.label.div) {
            markerData.label.div.style.zIndex = isSaved
              ? Z_INDEX.SAVED
              : Z_INDEX.DEFAULT
            markerData.label.isSaved = isSaved
          }
        }

        const newLabelData = (location.type_ids || [])
          .map((id) => getDisplayLabel(typesAccess, id))
          .filter(Boolean)
        markerData.labelData = newLabelData
      }
    })

    currentMarkers.forEach((markerData, locationId) => {
      const isHovered = hoveredLocationId === locationId
      const shouldShowLabel = showLabels || isHovered

      if (
        shouldShowLabel &&
        !markerData.label &&
        markerData.labelData.length > 0
      ) {
        const labelHtml = formatLabelHtml(markerData.labelData, selectedTypes)
        markerData.label = createLabel(
          google,
          googleMap,
          markerData.location,
          labelHtml,
          isHovered,
          mapType,
          markerData.isSaved,
        )
      }

      if (!shouldShowLabel && markerData.label) {
        markerData.label.setMap(null)
        markerData.label = null
      }

      if (markerData.label && markerData.label.div) {
        if (markerData.label.moveToPane) {
          markerData.label.moveToPane(isHovered)
        }

        if (markerData.label.updateStyle) {
          markerData.label.updateStyle(mapType)
        }

        const newLabelHtml = formatLabelHtml(
          markerData.labelData,
          selectedTypes,
        )
        if (markerData.label.updateHtml) {
          markerData.label.updateHtml(newLabelHtml)
        }

        const spans =
          markerData.label.div.querySelectorAll('span[data-type-id]')
        spans.forEach((span) => {
          const typeId = parseInt(span.getAttribute('data-type-id'), 10)
          const isSelected = selectedTypes.includes(typeId)
          span.style.opacity = isSelected ? '1.0' : '0.5'
        })
      }
    })
  }, [
    locations,
    googleMap,
    getGoogleMaps,
    onLocationClick,
    typesAccess,
    selectedTypes,
    showLabels,
    hoveredLocationId,
    mapType,
    streetViewOpen,
  ])

  useEffect(
    () => () => {
      const google = getGoogleMaps?.()
      if (!google) {
        return
      }

      markersRef.current.forEach((markerData) => {
        markerData.marker.setMap(null)
        if (markerData.label) {
          markerData.label.setMap(null)
        }
        google.event.clearInstanceListeners(markerData.marker)
      })

      markersRef.current.clear()
    },
    [getGoogleMaps],
  )

  return null
}

export default LocationMarkers
