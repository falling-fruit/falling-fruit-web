import { MapType } from '../../constants/settings'
import { theme } from '../ui/GlobalStyle'

// Shared marker + label rendering used by both the map (LocationMarkers) and
// the Street View panorama (PanoramaHandler), so both look identical.

export const Z_INDEX = {
  SAVED: 2,
  DEFAULT: 1,
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const formatLabelHtml = (labelData, selectedTypes) =>
  labelData
    .map((item) => {
      const escapedText = escapeHtml(item.text)
      const content = item.isScientific ? `<i>${escapedText}</i>` : escapedText
      const isSelected = selectedTypes.includes(item.typeId)
      const opacity = isSelected ? '1.0' : '0.5'
      return `<span data-type-id="${item.typeId}" style="opacity: ${opacity}">${content}</span>`
    })
    .join('<br>')

const createTextShadow = (color, size = 1, times = 1) => {
  const shadows = []
  for (let i = 0; i < times; i++) {
    shadows.push(`0px 0px ${size}px ${color}`)
  }
  return shadows.join(', ')
}

const getLabelStyleConfig = (mapType) => {
  const configs = {
    [MapType.Hybrid]: {
      fontWeight: 500,
      color: theme.background,
      textShadow: createTextShadow(theme.headerText, 2, 5),
      backgroundColor: 'unset',
    },
  }

  return (
    configs[mapType] || {
      fontWeight: 500,
      color: theme.secondaryText,
      textShadow: createTextShadow(theme.background, 2, 10),
      backgroundColor: 'unset',
    }
  )
}

const setLabelTextStyle = (div, mapType) => {
  const config = getLabelStyleConfig(mapType)
  Object.keys(config).forEach((key) => {
    div.style[key] = config[key]
  })
}

const createBaseLabelDiv = (isSaved) => {
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.padding = '4px 8px'
  div.style.fontSize = '12px'
  div.style.pointerEvents = 'none'
  div.style.marginTop = '5px'
  div.style.textAlign = 'center'
  div.style.display = 'block'
  div.style.zIndex = isSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT
  return div
}

// Create an OverlayView label for a location. `mapOrPanorama` may be a Map or a
// StreetViewPanorama; OverlayView supports both and projects accordingly.
export const createLabel = (
  google,
  mapOrPanorama,
  location,
  labelHtml,
  isHovered,
  mapType,
  isSaved,
) => {
  const label = new google.OverlayView()
  label.position = new google.LatLng(location.lat, location.lng)
  label.labelHtml = labelHtml
  label.locationId = location.id
  label.overlayLayerPane = null
  label.overlayMouseTargetPane = null
  label.isHovered = isHovered
  label.mapType = mapType
  label.isSaved = isSaved

  label.onAdd = function () {
    const div = createBaseLabelDiv(this.isSaved)
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

  label.updatePosition = function (google, lat, lng) {
    this.position = new google.LatLng(lat, lng)
    this.draw()
  }

  label.updateHtml = function (newHtml) {
    if (!this.div || this.labelHtml === newHtml) {
      return
    }
    this.labelHtml = newHtml
    this.div.innerHTML = newHtml
  }

  label.setMap(mapOrPanorama)
  return label
}

export const getMarkerIcon = (google, isSaved) => ({
  url: isSaved ? '/saved_location_dot.svg' : '/location_blue_dot.svg',
  anchor: new google.Point(8, 8),
  scaledSize: new google.Size(16, 16),
})
