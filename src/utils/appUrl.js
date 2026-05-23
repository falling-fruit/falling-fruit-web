const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 4

const VIEW_SEGMENT_REGEX =
  /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,[1-9]\d*z$/

const validateLatLngZoom = (lat, lng, zoom) => {
  if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) {
    return null
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || zoom > 22) {
    return null
  }

  return { center: { lat, lng }, zoom }
}

const legacyViewFromSearchParams = (searchParams) => {
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

const findViewSegmentIndex = (pathname) => {
  const parts = pathname.split('/')
  for (let i = parts.length - 1; i >= 0; i--) {
    const partWithoutParams = parts[i].split('?')[0]
    if (VIEW_SEGMENT_REGEX.test(partWithoutParams)) {
      return pathname.lastIndexOf(`/${parts[i]}`)
    }
  }
  return -1
}

const pathWithoutView = (path) => {
  const stateIndex = findViewSegmentIndex(path)
  return stateIndex === -1 ? path : path.substring(0, stateIndex)
}

export const currentPathWithoutViewSegment = () => {
  const { pathname } = new URL(window.location.href)
  return pathWithoutView(pathname)
}

export const viewToString = (lat, lng, zoom) => {
  // 7 decimal places gives precision to 1 cm
  // Normalize longitude to -180 to 180 range
  const normalizedLng = ((lng + 540) % 360) - 180
  return `${lat.toFixed(7)},${normalizedLng.toFixed(7)},${zoom}z`
}

export const applyLegacyViewParams = (searchParams, view) => {
  if (!view) {
    return
  }
  const { lat, lng } = view.center
  const normalizedLng = ((lng + 540) % 360) - 180
  searchParams.set('x', normalizedLng.toFixed(7))
  searchParams.set('y', lat.toFixed(7))
  searchParams.set('z', String(view.zoom))
}

const dropEmptyParams = (searchParams) => {
  const keysToDelete = []
  for (const [key, value] of searchParams.entries()) {
    if (value === '') {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach((key) => searchParams.delete(key))
}

const pathComponentsToString = (path, view, searchParams) => {
  const urlParts = []
  urlParts.push(path.replace(/\/*$/, '')) // */

  if (view) {
    urlParts.push('/')
    urlParts.push(viewToString(view.center.lat, view.center.lng, view.zoom))
  }

  if (searchParams) {
    dropEmptyParams(searchParams)
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
  const parts = pathname.split('/')
  const viewSegment = parts.find((part) =>
    VIEW_SEGMENT_REGEX.test(part.split('?')[0]),
  )

  if (!viewSegment) {
    return null
  }

  const parsedUrlValues = viewSegment
    .split('?')[0]
    .substring(0, viewSegment.split('?')[0].length - 1)
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
  if (path.startsWith('#') || findViewSegmentIndex(path) !== -1) {
    return path
  }

  // Split any params off the incoming path and merge them into the search params
  const [pathWithoutParams, incomingSearch] = path.split('?')
  const incomingParams = new URLSearchParams(incomingSearch)

  const { search } = new URL(window.location.href)
  const searchParams = new URLSearchParams(search)
  searchParams.delete('fromPage')

  // Merge incoming params into searchParams (incoming params take precedence)
  for (const [key, value] of incomingParams.entries()) {
    searchParams.set(key, value)
  }

  const currentView = viewFromCurrentUrl()
  if (currentView) {
    return pathComponentsToString(pathWithoutParams, currentView, searchParams)
  }

  const legacyView = legacyViewFromSearchParams(searchParams)
  if (legacyView) {
    searchParams.delete('x')
    searchParams.delete('y')
    searchParams.delete('z')
    return pathComponentsToString(pathWithoutParams, legacyView, searchParams)
  }

  return pathComponentsToString(pathWithoutParams, null, searchParams)
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

export const isViewSegment = (segment) => VIEW_SEGMENT_REGEX.test(segment)
