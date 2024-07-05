const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 1

export const getBaseUrl = () => {
  const { pathname } = new URL(window.location.href)
  const stateIndex = pathname.indexOf('/@')

  if (stateIndex === -1) {
    return pathname
  } else {
    return pathname.substring(0, stateIndex)
  }
}

export const getPathWithMapState = (path) => {
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

export const parseUrl = () => {
  const { pathname } = window.location
  const geocoordMatch = pathname.substring(pathname.indexOf('@'))

  const coords = getValidCoord(geocoordMatch)

  if (coords) {
    return {
      center: { lat: coords.lat, lng: coords.lng },
      zoom: coords.zoom,
    }
  } else {
    return {
      center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
      zoom: DEFAULT_ZOOM,
    }
  }
}

const getValidCoord = (geocoordMatch) => {
  //@lat,long,zoomz
  const urlFormatMatchRegex =
    /^@\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?,[1-9]\d*z$/
  if (!geocoordMatch) {
    return null
  }
  const urlParamString = geocoordMatch

  if (!urlFormatMatchRegex.test(urlParamString)) {
    return null
  }
  const parsedUrlValues = urlParamString
    .substring(1, urlParamString.length - 1)
    .split(',')

  const lat = parseFloat(parsedUrlValues[0])
  const lng = parseFloat(parsedUrlValues[1])
  const zoom = parseInt(parsedUrlValues[2])
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || zoom > 21) {
    return null
  }

  return {
    lat: parseFloat(parsedUrlValues[0]),
    lng: parseFloat(parsedUrlValues[1]),
    zoom: parseFloat(parsedUrlValues[2]),
  }
}
