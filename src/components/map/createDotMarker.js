import { theme } from '../ui/GlobalStyle'

const Z_INDEX = {
  SAVED: 2,
  DEFAULT: 1,
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

const createTextShadow = (color, size = 1, times = 1) => {
  const shadows = []
  for (let i = 0; i < times; i++) {
    shadows.push(`0px 0px ${size}px ${color}`)
  }
  return shadows.join(', ')
}

const setLabelTextStyle = (div, invertColors) => {
  div.style.fontWeight = 500
  div.style.backgroundColor = 'unset'
  if (invertColors) {
    div.style.color = theme.background
    div.style.textShadow = createTextShadow(theme.headerText, 2, 5)
  } else {
    div.style.color = theme.secondaryText
    div.style.textShadow = createTextShadow(theme.background, 2, 10)
  }
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
  div.style.whiteSpace = 'nowrap'
  div.style.zIndex = isSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT
  return div
}

const createLabel = (
  google,
  mapOrPanorama,
  location,
  typesAccess,
  selectedTypes,
  invertColors,
  isSaved,
  isHovered = false,
) => {
  const label = new google.OverlayView()
  label.position = new google.LatLng(location.lat, location.lng)
  label.typesAccess = typesAccess
  label.selectedTypes = selectedTypes
  label.locationId = location.id
  label.overlayLayerPane = null
  label.overlayMouseTargetPane = null
  label.isHovered = isHovered
  label.invertColors = invertColors
  label.isSaved = isSaved

  label._buildLabelData = function () {
    return (location.type_ids || [])
      .map((id) => this.typesAccess.getDisplayLabel(id))
      .filter(Boolean)
  }

  label.onAdd = function () {
    const div = createBaseLabelDiv(this.isSaved)
    setLabelTextStyle(div, this.invertColors)
    div.innerHTML = formatLabelHtml(this._buildLabelData(), this.selectedTypes)

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

    if (position) {
      this.div.style.left = `${position.x}px`
      this.div.style.top = `${position.y}px`
      this.div.style.transform = 'translate(-50%, 0)'
    }
  }

  label.onRemove = function () {
    if (this.div) {
      this.div.parentNode.removeChild(this.div)
      this.div = null
    }
  }

  label.sync = function (
    newTypesAccess,
    newSelectedTypes,
    newIsHovered,
    newInvertColors,
  ) {
    this.typesAccess = newTypesAccess
    this.selectedTypes = newSelectedTypes
    this.isHovered = newIsHovered
    this.invertColors = newInvertColors

    if (!this.div) {
      return
    }

    setLabelTextStyle(this.div, this.invertColors)

    this.div.innerHTML = formatLabelHtml(
      this._buildLabelData(),
      this.selectedTypes,
    )

    const targetPane = this.isHovered
      ? this.overlayMouseTargetPane
      : this.overlayLayerPane
    if (this.div.parentNode !== targetPane) {
      targetPane.appendChild(this.div)
    }
  }

  label.updatePosition = function (google, lat, lng) {
    this.position = new google.LatLng(lat, lng)
    this.draw()
  }

  label.setMap(mapOrPanorama)
  return label
}

const getMarkerIcon = (google, isSaved) => ({
  url: isSaved ? '/saved_location_dot.svg' : '/location_blue_dot.svg',
  anchor: new google.Point(8, 8),
  scaledSize: new google.Size(16, 16),
})

export const createLocationDotMarker = (
  google,
  mapOrPanorama,
  location,
  { optimized = false } = {},
) => {
  const isSaved = Boolean(location.in_list)
  const marker = new google.Marker({
    position: { lat: location.lat, lng: location.lng },
    map: mapOrPanorama,
    optimized,
    icon: getMarkerIcon(google, isSaved),
    zIndex: isSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT,
  })

  marker._label = null
  marker._google = google
  marker._mapOrPanorama = mapOrPanorama
  marker._location = location
  marker._isSaved = isSaved
  marker._isHovered = false

  marker._typesAccess = null
  marker._selectedTypes = null
  marker._showLabels = false
  marker._invertColors = false

  marker._hoverListeners = []

  marker.setLabel = function (
    typesAccess,
    selectedTypes,
    invertColors,
    isHovered = false,
  ) {
    this._label = createLabel(
      this._google,
      this._mapOrPanorama,
      this._location,
      typesAccess,
      selectedTypes,
      invertColors,
      this._isSaved,
      isHovered,
    )
  }

  marker.removeLabel = function () {
    if (this._label) {
      this._label.setMap(null)
      this._label = null
    }
  }

  marker.syncLabel = function (
    typesAccess,
    selectedTypes,
    showLabels,
    invertColors,
  ) {
    this._typesAccess = typesAccess
    this._selectedTypes = selectedTypes
    this._showLabels = showLabels
    this._invertColors = invertColors

    const shouldShow = showLabels || this._isHovered

    if (shouldShow && !this._label) {
      this.setLabel(typesAccess, selectedTypes, invertColors, this._isHovered)
    } else if (!shouldShow && this._label) {
      this.removeLabel()
    } else if (this._label) {
      this._label.sync(
        typesAccess,
        selectedTypes,
        this._isHovered,
        invertColors,
      )
    }
  }

  marker.attachHoverListeners = function () {
    const overListener = google.event.addListener(this, 'mouseover', () => {
      this._isHovered = true
      if (this._typesAccess && this._selectedTypes) {
        if (!this._label) {
          this.setLabel(
            this._typesAccess,
            this._selectedTypes,
            this._invertColors,
            true,
          )
        } else {
          this._label.sync(
            this._typesAccess,
            this._selectedTypes,
            true,
            this._invertColors,
          )
        }
      }
    })

    const outListener = google.event.addListener(this, 'mouseout', () => {
      this._isHovered = false
      if (this._label) {
        if (this._showLabels) {
          this._label.sync(
            this._typesAccess,
            this._selectedTypes,
            false,
            this._invertColors,
          )
        } else {
          this.removeLabel()
        }
      }
    })

    this._hoverListeners = [overListener, outListener]
  }

  marker.detachHoverListeners = function () {
    this._hoverListeners.forEach(google.event.removeListener)
    this._hoverListeners = []
  }

  marker.updateSavedState = function (newIsSaved) {
    this._isSaved = newIsSaved
    this.setIcon(getMarkerIcon(this._google, newIsSaved))
    this.setZIndex(newIsSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT)
    if (this._label && this._label.div) {
      this._label.div.style.zIndex = newIsSaved
        ? Z_INDEX.SAVED
        : Z_INDEX.DEFAULT
      this._label.isSaved = newIsSaved
    }
  }

  marker.updatePosition = function (lat, lng) {
    this._location = { ...this._location, lat, lng }
    this.setPosition({ lat, lng })
    if (this._label) {
      this._label.updatePosition(this._google, lat, lng)
    }
  }

  marker.attachHoverListeners()

  return marker
}
