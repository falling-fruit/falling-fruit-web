import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { MapType } from '../../constants/settings'
import { theme } from '../ui/GlobalStyle'

const getDisplayLabel = (typesAccess, id) => {
  const type = typesAccess.getType(id)
  if (!type) {
    return null
  }

  if (type.cultivar) {
    const parentType = typesAccess.getParentType(id)
    if (
      parentType &&
      parentType.commonName &&
      parentType.scientificName &&
      (!type.commonName ||
        type.commonName.toLowerCase() === parentType.commonName.toLowerCase())
    ) {
      return {
        text: `${parentType.commonName} '${type.cultivar}'`,
        isScientific: false,
        typeId: id,
      }
    }
  }

  if (type.commonName) {
    return {
      text: type.commonName,
      isScientific: false,
      typeId: id,
    }
  }

  if (type.scientificName) {
    return {
      text: type.scientificName,
      isScientific: true,
      typeId: id,
    }
  }

  return null
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const formatLabelHtml = (labelData, selectedTypes) =>
  labelData
    .map((item) => {
      const escapedText = escapeHtml(item.text)
      const content = item.isScientific ? `<i>${escapedText}</i>` : escapedText
      const isSelected = selectedTypes.includes(item.typeId)
      const opacity = isSelected ? '1.0' : '0.5'
      return `<span data-type-id="${item.typeId}" style="opacity: ${opacity}">${content}</span>`
    })
    .join('<br>')

const createTextShadow = (color, offsetX = 1, offsetY = 1) =>
  `${-offsetX}px ${-offsetY}px 0 ${color}, ${offsetX}px ${-offsetY}px 0 ${color}, ${-offsetX}px ${offsetY}px 0 ${color}, ${offsetX}px ${offsetY}px 0 ${color}`

const getLabelStyleConfig = (mapType) => {
  const configs = {
    [MapType.Hybrid]: {
      fontWeight: 'bold',
      color: theme.background,
      textShadow: createTextShadow(theme.headerText, 1, 1),
      backgroundColor: 'unset',
    },
    [MapType.OsmStandard]: {
      fontWeight: 'normal',
      color: theme.secondaryText,
      textShadow: 'unset',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    [MapType.OsmTonerLite]: {
      fontWeight: 'bold',
      color: theme.secondaryText,
      textShadow: createTextShadow(theme.background, 2, 2),
      backgroundColor: 'unset',
    },
  }

  return (
    configs[mapType] || {
      fontWeight: 'normal',
      color: theme.secondaryText,
      textShadow: createTextShadow(theme.background, 1, 1),
      backgroundColor: 'unset',
    }
  )
}

const setLabelTextStyle = (div, mapType) => {
  const config = getLabelStyleConfig(mapType)
  div.style.fontWeight = config.fontWeight
  div.style.color = config.color
  div.style.textShadow = config.textShadow
  div.style.backgroundColor = config.backgroundColor
}

const createBaseLabelDiv = () => {
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.padding = '4px 8px'
  div.style.fontSize = '12px'
  div.style.pointerEvents = 'none'
  div.style.marginTop = '5px'
  div.style.textAlign = 'center'
  div.style.display = 'block'
  return div
}

const createLabel = (
  google,
  googleMap,
  location,
  labelHtml,
  isHovered,
  mapType,
) => {
  const label = new google.OverlayView()
  label.position = new google.LatLng(location.lat, location.lng)
  label.labelHtml = labelHtml
  label.locationId = location.id
  label.overlayLayerPane = null
  label.overlayMouseTargetPane = null
  label.isHovered = isHovered
  label.mapType = mapType

  label.onAdd = function () {
    const div = createBaseLabelDiv()
    setLabelTextStyle(div, this.mapType)
    div.innerHTML = this.labelHtml

    this.div = div
    const panes = this.getPanes()
    this.overlayLayerPane = panes.overlayLayer
    this.overlayMouseTargetPane = panes.overlayMouseTarget
    const targetPane = this.isHovered
      ? this.overlayMouseTargetPane
      : this.overlayLayerPane
    targetPane.appendChild(div)
  }

  label.draw = function () {
    const projection = this.getProjection()
    const position = projection.fromLatLngToDivPixel(this.position)

    const div = this.div
    div.style.left = `${position.x}px`
    div.style.top = `${position.y}px`
    div.style.transform = 'translate(-50%, 0)'
  }

  label.onRemove = function () {
    if (this.div) {
      this.div.parentNode.removeChild(this.div)
      this.div = null
    }
  }

  label.moveToPane = function (isHovered) {
    if (!this.div || !this.overlayLayerPane || !this.overlayMouseTargetPane) {
      return
    }
    const targetPane = isHovered
      ? this.overlayMouseTargetPane
      : this.overlayLayerPane
    if (this.div.parentNode !== targetPane) {
      targetPane.appendChild(this.div)
    }
  }

  label.updateStyle = function (mapType) {
    if (!this.div) {
      return
    }
    this.mapType = mapType
    setLabelTextStyle(this.div, mapType)
  }

  label.setMap(googleMap)
  return label
}

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

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return
    }

    const google = getGoogleMaps()
    const currentMarkers = markersRef.current

    const newLocationIds = new Set(locations.map((loc) => loc.id))
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

    locations.forEach((location) => {
      if (!existingLocationIds.has(location.id)) {
        const labelData = (location.type_ids || [])
          .map((id) => getDisplayLabel(typesAccess, id))
          .filter(Boolean)

        const marker = new google.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: googleMap,
          optimized: locations.length > 100,
          icon: {
            url: '/location_blue_dot.svg',
            anchor: new google.Point(8, 8),
            scaledSize: new google.Size(16, 16),
          },
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
        })
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
