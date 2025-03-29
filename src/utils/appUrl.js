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

  // Check for current URL path state
  const { pathname, search } = new URL(window.location.href)
  const mapStateIndex = pathname.indexOf('/@')

  // Check for legacy x,y,z parameters in the URL
  const searchParams = new URLSearchParams(search)
  const legacyLat = searchParams.get('x')
  const legacyLng = searchParams.get('y')
  const legacyZoom = searchParams.get('z')

  // If we have legacy coordinates, use them
  if (legacyLat && legacyLng && legacyZoom) {
    const lat = parseFloat(legacyLat)
    const lng = parseFloat(legacyLng)
    const zoom = parseInt(legacyZoom, 10)

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
      const pathNoTrailingSlash = path.replace(/\/*$/, '')
      return `${pathNoTrailingSlash}/${viewToString(lat, lng, zoom)}${search}`
    }
  }

  // Otherwise use the path state if it exists
  if (mapStateIndex === -1) {
    // Preserve search parameters
    return search ? `${path}${search}` : path
  }

  const mapState = pathname.substring(mapStateIndex)
  const pathNoTrailingSlash = path.replace(/\/*$/, '')

  // Preserve search parameters
  return `${pathNoTrailingSlash}${mapState}${search}`
}

export const currentPathWithView = (view) => {
  const { pathname } = new URL(window.location.href)
  const stateIndex = pathname.indexOf('/@')

  const path = stateIndex === -1 ? pathname : pathname.substring(0, stateIndex)

  return `${path}/${viewToString(view.center.lat, view.center.lng, view.zoom)}`
}

export const pathWithView = (path, view) => {
  const stateIndex = path.indexOf('/@')
  const cleanPath = stateIndex === -1 ? path : path.substring(0, stateIndex)
  const pathNoTrailingSlash = cleanPath.replace(/\/*$/, '')

  return `${pathNoTrailingSlash}/${viewToString(view.center.lat, view.center.lng, view.zoom)}`
}
