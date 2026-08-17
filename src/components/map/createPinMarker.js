import { theme } from '../ui/GlobalStyle'

const Z_INDEX = {
  SELECTED: 10,
  DRAGGABLE: 11,
  TOOLTIP: 12,
}

const pinSvgDataUri = (color) => {
  const svg = `<svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const getSelectedPinIcon = (google, isEditing) => ({
  url: pinSvgDataUri(isEditing ? theme.transparentOrange : theme.orange),
  scaledSize: new google.Size(48, 48),
  anchor: new google.Point(24, 44),
})

const getDraggablePinIcon = (google, isAdding) => ({
  url: pinSvgDataUri(isAdding ? theme.blue : theme.orange),
  scaledSize: new google.Size(48, 48),
  anchor: new google.Point(24, 44),
})

export const createTooltipOverlay = (google, map, position, html, onClose) => {
  const overlay = new google.OverlayView()
  overlay._position = new google.LatLng(position.lat, position.lng)
  overlay._html = html
  overlay._onClose = onClose
  overlay._div = null

  overlay.onAdd = function () {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.zIndex = Z_INDEX.TOOLTIP
    container.style.pointerEvents = 'auto'

    // Tooltip box
    const box = document.createElement('div')
    box.style.position = 'relative'
    box.style.backgroundColor = theme.background || '#fff'
    box.style.color = theme.text || '#000'
    box.style.padding = '16px'
    box.style.borderRadius = '4px'
    box.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
    box.style.fontSize = '16px'
    box.style.whiteSpace = 'nowrap'
    box.style.transform = 'translate(-50%, -100%)'
    box.style.marginTop = '-52px'

    // Close button
    const closeBtn = document.createElement('button')
    closeBtn.style.position = 'absolute'
    closeBtn.style.top = '4px'
    closeBtn.style.right = '4px'
    closeBtn.style.background = 'none'
    closeBtn.style.border = 'none'
    closeBtn.style.cursor = 'pointer'
    closeBtn.style.padding = '2px'
    closeBtn.style.lineHeight = '1'
    closeBtn.style.fontSize = '16px'
    closeBtn.innerHTML = '&#x2715;' // ✕
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (overlay._onClose) {
        overlay._onClose()
      }
    })

    // Content
    const content = document.createElement('div')
    content.style.padding = '8px'
    content.setAttribute('dir', 'auto')
    content.innerHTML = overlay._html

    // Arrow
    const arrow = document.createElement('div')
    arrow.style.position = 'absolute'
    arrow.style.bottom = '-10px'
    arrow.style.left = '50%'
    arrow.style.transform = 'translateX(-50%)'
    arrow.style.width = '0'
    arrow.style.height = '0'
    arrow.style.borderWidth = '10px 10px 0'
    arrow.style.borderStyle = 'solid'
    arrow.style.borderColor = `${theme.background || '#fff'} transparent transparent transparent`

    box.appendChild(closeBtn)
    box.appendChild(content)
    box.appendChild(arrow)
    container.appendChild(box)

    overlay._div = container
    const panes = this.getPanes()
    panes.floatPane.appendChild(container)
  }

  overlay.draw = function () {
    if (!overlay._div) {
      return
    }
    const projection = this.getProjection()
    const point = projection.fromLatLngToDivPixel(overlay._position)
    if (point) {
      overlay._div.style.left = `${point.x}px`
      overlay._div.style.top = `${point.y}px`
    }
  }

  overlay.onRemove = function () {
    if (overlay._div && overlay._div.parentNode) {
      overlay._div.parentNode.removeChild(overlay._div)
      overlay._div = null
    }
  }

  overlay.updatePosition = function (lat, lng) {
    overlay._position = new google.LatLng(lat, lng)
    overlay.draw()
  }

  overlay.setMap(map)
  return overlay
}

export const createSelectedPin = (
  google,
  map,
  position,
  { isEditing = false } = {},
) => {
  const marker = new google.Marker({
    position,
    map,
    icon: getSelectedPinIcon(google, isEditing),
    zIndex: Z_INDEX.SELECTED,
    clickable: false,
  })

  marker._isEditing = isEditing

  marker.updateEditingState = function (newIsEditing) {
    this._isEditing = newIsEditing
    this.setIcon(getSelectedPinIcon(google, newIsEditing))
  }

  marker.updatePosition = function (lat, lng) {
    this.setPosition({ lat, lng })
  }

  return marker
}

export const createDraggablePin = (
  google,
  map,
  position,
  { isAdding = false, onDragEnd } = {},
) => {
  const marker = new google.Marker({
    position,
    map,
    icon: getDraggablePinIcon(google, isAdding),
    zIndex: Z_INDEX.DRAGGABLE,
    draggable: true,
    cursor: 'grab',
  })

  marker._isAdding = isAdding
  marker._dragEndListener = null
  marker._dragListener = null

  if (onDragEnd) {
    marker._dragEndListener = google.event.addListener(
      marker,
      'dragend',
      (e) => {
        onDragEnd({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      },
    )
  }

  marker.updatePosition = function (lat, lng) {
    this.setPosition({ lat, lng })
  }

  marker.destroy = function () {
    if (this._dragEndListener) {
      google.event.removeListener(this._dragEndListener)
      this._dragEndListener = null
    }
    if (this._dragListener) {
      google.event.removeListener(this._dragListener)
      this._dragListener = null
    }
    this.setMap(null)
  }

  return marker
}
