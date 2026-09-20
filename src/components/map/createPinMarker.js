import { theme } from '../ui/GlobalStyle'

const Z_INDEX = {
  SELECTED: 10,
  DRAGGABLE: 11,
}

const DRAGGABLE_PIN_SCALE = 1.35

const pinSvgDataUri = (color) => {
  const svg = `<svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M12 2C7.589 2 4 5.589 4 9.995 3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12 0-4.411-3.589-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const getSelectedPinIcon = (google, isEditing) => {
  const color = isEditing ? theme.transparentOrange : theme.orange
  const scale = isEditing ? DRAGGABLE_PIN_SCALE : 1
  return {
    url: pinSvgDataUri(color),
    scaledSize: new google.Size(scale * 48, scale * 48),
    anchor: new google.Point(scale * 24, scale * 44),
  }
}

const getDraggablePinIcon = (google) => ({
  url: pinSvgDataUri(theme.orange),
  scaledSize: new google.Size(
    DRAGGABLE_PIN_SCALE * 48,
    DRAGGABLE_PIN_SCALE * 48,
  ),
  anchor: new google.Point(DRAGGABLE_PIN_SCALE * 24, DRAGGABLE_PIN_SCALE * 44),
})

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
