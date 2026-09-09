import { rgba } from 'polished'

import { theme } from '../ui/GlobalStyle'

/**
 * z-index within the shared marker pane. Location dots use 1-2 and location
 * pins use 10-11 (see createDotMarker/createPinMarker), so 5 renders the
 * geolocation dot above the location dots but below the location pins.
 */
const GEOLOCATION_Z_INDEX = 5

const STYLE_ELEMENT_ID = 'geolocation-marker-styles'

/**
 * Inject the keyframes/base styles once. These mirror the previous
 * GeolocationDot styled-component so the animation is preserved.
 */
const ensureStylesInjected = () => {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return
  }

  const style = document.createElement('style')
  style.id = STYLE_ELEMENT_ID
  style.textContent = `
    .geolocation-marker {
      position: absolute;
    }

    .geolocation-marker__anchor {
      position: absolute;
      transform: translate(-50%, -50%);
    }

    .geolocation-marker__pin {
      position: absolute;
      z-index: 1;
      transform: translate(-50%, -50%);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${theme.orange};
    }

    .geolocation-marker__pulse::before,
    .geolocation-marker__pulse::after {
      content: '';
      width: 34px;
      height: 34px;
      position: absolute;
      transform: translate(-50%, -50%);
      transform-origin: 50% 50%;
      border-radius: 50%;
    }

    .geolocation-marker__pulse--pulsing::before {
      z-index: 1;
      background: radial-gradient(
        ${rgba(theme.orange, 0.75)},
        ${rgba(theme.orange, 0)}
      );
      animation: 3s ease infinite geolocationPulseScale;
    }

    .geolocation-marker__pulse::after {
      z-index: 3;
      box-shadow: 0 0 0 7px #fefefe inset;
      animation: 3s ease infinite geolocationPulseBoxShadow;
    }

    .geolocation-marker__heading {
      position: absolute;
      bottom: 0;
      left: -35px;
      transform-origin: bottom center;
      height: 55px;
      width: 70px;
      clip-path: polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%);
      background: linear-gradient(
        to top,
        ${theme.orange},
        ${rgba(theme.orange, 0)}
      );
    }

    @keyframes geolocationPulseBoxShadow {
      0% {
        box-shadow: 0 0 0 7px #fefefe inset;
      }
      50% {
        box-shadow: 0 0 0 5px #fefefe inset;
      }
      100% {
        box-shadow: 0 0 0 7px #fefefe inset;
      }
    }

    @keyframes geolocationPulseScale {
      0% {
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  `
  document.head.appendChild(style)
}

/**
 * Creates a geolocation dot as a google.maps OverlayView rendered into the
 * marker pane, so it layers correctly relative to location markers/pins while
 * keeping the pulsing animation and heading cone.
 *
 * @param {object} google - google.maps namespace
 * @param {google.maps.Map} map
 * @param {{ latitude: number, longitude: number, heading: number|null }} geolocation
 * @param {{ isPulsing: boolean, isClickable: boolean, onClick: function }} options
 */
export const createGeolocationMarker = (
  google,
  map,
  geolocation,
  { isPulsing = true, isClickable = false, onClick } = {},
) => {
  ensureStylesInjected()

  const overlay = new google.OverlayView()

  overlay._position = new google.LatLng(
    geolocation.latitude,
    geolocation.longitude,
  )
  overlay._heading = geolocation.heading
  overlay._isPulsing = isPulsing
  overlay._isClickable = isClickable
  overlay._onClick = onClick
  overlay._container = null
  overlay._pulse = null
  overlay._heading$ = null
  overlay._clickListener = null

  overlay._applyState = function () {
    if (!this._container) {
      return
    }

    this._container.style.cursor = this._isClickable ? 'pointer' : ''
    this._container.style.pointerEvents = this._isClickable ? 'auto' : 'none'

    // Heading cone suppresses the pulse (matches the previous hasHeadingLtr logic)
    const hasHeading = this._heading !== null && this._heading !== undefined
    this._pulse.classList.toggle(
      'geolocation-marker__pulse--pulsing',
      this._isPulsing && !hasHeading,
    )

    if (hasHeading) {
      if (!this._heading$) {
        this._heading$ = document.createElement('div')
        this._heading$.className = 'geolocation-marker__heading'
        this._anchor.appendChild(this._heading$)
      }
      this._heading$.style.transform = `rotate(${this._heading}deg)`
    } else if (this._heading$) {
      this._heading$.remove()
      this._heading$ = null
    }
  }

  overlay.onAdd = function () {
    const container = document.createElement('div')
    container.className = 'geolocation-marker'
    container.style.zIndex = GEOLOCATION_Z_INDEX
    container.dir = 'ltr'

    // Anchor is the point positioned at the geolocation coordinate.
    const anchor = document.createElement('div')
    anchor.className = 'geolocation-marker__anchor'

    const pulse = document.createElement('div')
    pulse.className = 'geolocation-marker__pulse'

    const pin = document.createElement('div')
    pin.className = 'geolocation-marker__pin'

    anchor.appendChild(pulse)
    anchor.appendChild(pin)
    container.appendChild(anchor)

    this._container = container
    this._anchor = anchor
    this._pulse = pulse

    this._clickListener = (event) => {
      event.stopPropagation()
      if (this._isClickable && this._onClick) {
        this._onClick()
      }
    }
    container.addEventListener('click', this._clickListener)

    // markerLayer is the same pane google.maps.Marker uses, so zIndex on the
    // container interleaves this overlay with the location markers/pins.
    this.getPanes().markerLayer.appendChild(container)

    this._applyState()
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
    if (this._clickListener && this._container) {
      this._container.removeEventListener('click', this._clickListener)
    }
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container)
    }
    this._container = null
    this._anchor = null
    this._pulse = null
    this._heading$ = null
    this._clickListener = null
  }

  overlay.update = function (newGeolocation, newOptions = {}) {
    this._position = new google.LatLng(
      newGeolocation.latitude,
      newGeolocation.longitude,
    )
    this._heading = newGeolocation.heading
    if ('isPulsing' in newOptions) {
      this._isPulsing = newOptions.isPulsing
    }
    if ('isClickable' in newOptions) {
      this._isClickable = newOptions.isClickable
    }
    if ('onClick' in newOptions) {
      this._onClick = newOptions.onClick
    }
    this._applyState()
    this.draw()
  }

  overlay.setMap(map)
  return overlay
}
