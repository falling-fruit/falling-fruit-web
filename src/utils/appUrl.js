export const viewToString = (lat, lng, zoom) => {
  // 7 decimal places gives precision to 1 cm
  // Normalize longitude to -180 to 180 range
  const normalizedLng = ((lng + 540) % 360) - 180
  return `@${lat.toFixed(7)},${normalizedLng.toFixed(7)},${zoom}z`
}

export const parseCurrentUrl = () => {
  const { pathname } = new URL(window.location.href)
  const stateIndex = pathname.indexOf('/@')

  const path = stateIndex === -1 ? pathname : pathname.substring(0, stateIndex)

  const geocoordMatch = pathname.substring(pathname.indexOf('@'))

  const urlFormatMatchRegex =
    /^@\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,[1-9]\d*z$/
  if (!geocoordMatch || !urlFormatMatchRegex.test(geocoordMatch)) {
    return { path, view: null }
  }
  const parsedUrlValues = geocoordMatch
    .substring(1, geocoordMatch.length - 1)
    .split(',')

  const lat = parseFloat(parsedUrlValues[0])
  const lng = parseFloat(parsedUrlValues[1])
  const zoom = parseInt(parsedUrlValues[2])

  if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) {
    return { path, view: null }
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || zoom > 22) {
    return { path, view: null }
  }

  return { path, view: { center: { lat, lng }, zoom } }
}

export const pathToSignInPage = () => {
  const currentPath = window.location.pathname
  if (currentPath.startsWith('/users')) {
    return '/users/sign_in'
  } else {
    return `/users/sign_in?fromPage=${encodeURIComponent(currentPath)}`
  }
}

export const pathWithCurrentView = (path) => {
  if (path.startsWith('#') || path.indexOf('/@') !== -1) {
    return path
  }

  const { pathname } = new URL(window.location.href)
  const mapStateIndex = pathname.indexOf('/@')
  if (mapStateIndex === -1) {
    return path
  }

  const mapState = pathname.substring(mapStateIndex)
  const pathNoTrailingSlash = path.replace(/\/*$/, '')

  return pathNoTrailingSlash + mapState
}

export const currentPathWithView = (view) => {
  const { pathname } = new URL(window.location.href)
  const stateIndex = pathname.indexOf('/@')

  const path = stateIndex === -1 ? pathname : pathname.substring(0, stateIndex)

  return `${path}/${viewToString(view.center.lat, view.center.lng, view.zoom)}`
}
