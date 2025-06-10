const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 4

const validateLatLngZoom = (lat, lng, zoom) => {
  if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) {
    return null
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || zoom > 22) {
    return null
  }

  return { center: { lat, lng }, zoom }
}

export const legacyViewFromSearchParams = (searchParams) => {
  const legacyLng = searchParams.get('x')
  const legacyLat = searchParams.get('y')
  const legacyZoom = searchParams.get('z')

  if (legacyLat || legacyLng || legacyZoom) {
    const lng = legacyLng ? parseFloat(legacyLng) : DEFAULT_LNG
    const lat = legacyLat ? parseFloat(legacyLat) : DEFAULT_LAT
    const zoom = legacyZoom ? parseInt(legacyZoom, 10) : DEFAULT_ZOOM

    return validateLatLngZoom(lat, lng, zoom)
  }

  return null
}

const pathWithoutView = (path) => {
  const stateIndex = path.indexOf('/@')
  return stateIndex === -1 ? path : path.substring(0, stateIndex)
}

export const viewToString = (lat, lng, zoom) => {
  // 7 decimal places gives precision to 1 cm
  // Normalize longitude to -180 to 180 range
  const normalizedLng = ((lng + 540) % 360) - 180
  return `@${lat.toFixed(7)},${normalizedLng.toFixed(7)},${zoom}z`
}

const pathComponentsToString = (path, view, searchParams) => {
  const urlParts = []
  urlParts.push(path.replace(/\/*$/, ''))

  if (view) {
    urlParts.push('/')
    urlParts.push(viewToString(view.center.lat, view.center.lng, view.zoom))
  }

  const searchString = searchParams?.toString()
  if (searchString) {
    urlParts.push('?')
    urlParts.push(searchString)
  }

  return urlParts.join('')
}

export const viewFromCurrentUrl = () =>
  parseViewFromCurrentUrl() || legacyViewFromCurrentUrl()

const legacyViewFromCurrentUrl = () => {
  const { search } = new URL(window.location.href)
  const searchParams = new URLSearchParams(search)
  return legacyViewFromSearchParams(searchParams)
}
const parseViewFromCurrentUrl = () => {
  const { pathname } = new URL(window.location.href)
  const geocoordMatch = pathname.substring(pathname.indexOf('@'))

  const urlFormatMatchRegex =
    /^@\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,[1-9]\d*z$/
  if (!geocoordMatch || !urlFormatMatchRegex.test(geocoordMatch)) {
    return null
  }
  const parsedUrlValues = geocoordMatch
    .substring(1, geocoordMatch.length - 1)
    .split(',')

  const lat = parseFloat(parsedUrlValues[0])
  const lng = parseFloat(parsedUrlValues[1])
  const zoom = parseInt(parsedUrlValues[2])

  return validateLatLngZoom(lat, lng, zoom)
}

export const pathToSignInPage = () => {
  const currentPath = window.location.pathname
  if (currentPath.startsWith('/auth')) {
    return '/auth/sign_in'
  } else {
    return `/auth/sign_in?fromPage=${encodeURIComponent(currentPath)}`
  }
}

export const pathWithCurrentView = (path) => {
  if (path.startsWith('#') || path.indexOf('/@') !== -1) {
    return path
  }

  const { search } = new URL(window.location.href)
  const searchParams = new URLSearchParams(search)
  searchParams.delete('fromPage')

  const currentView = viewFromCurrentUrl()
  if (currentView) {
    return pathComponentsToString(path, currentView, searchParams)
  }

  const legacyView = legacyViewFromSearchParams(searchParams)
  if (legacyView) {
    searchParams.delete('x')
    searchParams.delete('y')
    searchParams.delete('z')
    return pathComponentsToString(path, legacyView, searchParams)
  }

  return pathComponentsToString(path, null, searchParams)
}

export const currentPathWithView = (view) => {
  const { pathname, search } = new URL(window.location.href)

  return pathComponentsToString(
    pathWithoutView(pathname),
    view,
    new URLSearchParams(search),
  )
}

export const addParam = (url, paramName, paramValue) => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${paramName}=${paramValue}`
}

export const pathWithView = (path, view) =>
  pathComponentsToString(pathWithoutView(path), view, null)
