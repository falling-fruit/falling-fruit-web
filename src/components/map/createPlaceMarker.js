import { theme } from '../ui/GlobalStyle'

const PLACE_Z_INDEX = 3

const STYLE_ELEMENT_ID = 'place-marker-styles'

const CROSSHAIR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <line fill="none" stroke="#29A858" stroke-miterlimit="10" x1="50" y1="30" x2="50" y2="46"/>
  <line fill="none" stroke="#29A858" stroke-miterlimit="10" x1="46" y1="50" x2="30" y2="50"/>
  <line fill="none" stroke="#29A858" stroke-miterlimit="10" x1="70" y1="50" x2="54" y2="50"/>
  <line fill="none" stroke="#29A858" stroke-miterlimit="10" x1="50" y1="54" x2="50" y2="70"/>
  <line fill="none" stroke="#29A858" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="50" y1="50" x2="50" y2="50"/>
</svg>
`

const ensureStylesInjected = () => {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return
  }

  const style = document.createElement('style')
  style.id = STYLE_ELEMENT_ID
  style.textContent = `
    .place-marker {
      position: absolute;
      z-index: ${PLACE_Z_INDEX};
      pointer-events: none;
      touch-action: none;
    }

    .place-marker__crosshair {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
    }

    .place-marker__crosshair svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .place-marker__label {
      position: absolute;
      inset-inline-start: 50%;
      transform: translateX(-50%);
      margin-block-start: 20px;
      font-size: 1rem;
      color: ${theme.headerText};
      text-align: center;
      white-space: nowrap;
      text-shadow:
        -1px -1px 0 ${theme.background},
        1px -1px 0 ${theme.background},
        -1px 1px 0 ${theme.background},
        1px 1px 0 ${theme.background};
      user-select: none;
    }
  `
  document.head.appendChild(style)
}

export const createPlaceMarker = (google, map, position, label) => {
  ensureStylesInjected()

  const overlay = new google.OverlayView()

  overlay._position = new google.LatLng(position.lat, position.lng)
  overlay._label = label
  overlay._container = null
  overlay._label$ = null

  overlay.onAdd = function () {
    const container = document.createElement('div')
    container.className = 'place-marker'

    const crosshair = document.createElement('div')
    crosshair.className = 'place-marker__crosshair'
    crosshair.innerHTML = CROSSHAIR_SVG

    const labelEl = document.createElement('div')
    labelEl.className = 'place-marker__label'
    labelEl.textContent = this._label ?? ''

    container.appendChild(crosshair)
    container.appendChild(labelEl)

    this._container = container
    this._label$ = labelEl

    this.getPanes().overlayLayer.appendChild(container)
    this.draw()
  }

  overlay.draw = function () {
    if (!this._container) {
      return
    }
    const projection = this.getProjection()
    const point = projection
      ? projection.fromLatLngToDivPixel(this._position)
      : null
    if (point) {
      this._container.style.left = `${point.x}px`
      this._container.style.top = `${point.y}px`
    }
  }

  overlay.onRemove = function () {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container)
    }
    this._container = null
    this._label$ = null
  }

  overlay.update = function (newPosition, newLabel) {
    this._position = new google.LatLng(newPosition.lat, newPosition.lng)
    if (this._label !== newLabel) {
      this._label = newLabel
      if (this._label$) {
        this._label$.textContent = newLabel ?? ''
      }
    }
    this.draw()
  }

  overlay.setMap(map)
  return overlay
}
