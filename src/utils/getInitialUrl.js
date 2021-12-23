const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 1

export const getBaseUrl = () => {
  const { pathname } = new URL(window.location.href)

  return pathname.substring(0, pathname.indexOf('/@')) || '/map'
}

export const getPathWithMapState = (path) => {
  if (path.indexOf('/@') !== -1) {
    return path
  } else {
    const { pathname } = new URL(window.location.href)
    const pathNoTrailingSlash = path.replace(/\/*$/, '')
    const mapState = pathname.substring(pathname.indexOf('/@'))

    return pathNoTrailingSlash + mapState
  }
}

window.a = getPathWithMapState

export const parseUrl = () => {
  const url = window.location.href
  const geocoordMatch = url.substring(url.indexOf('@'))

  const getCoords = getValidCoord(geocoordMatch)

  if (getCoords) {
    return {
      center: { lat: getCoords.lat, lng: getCoords.lng },
      zoom: getCoords.zoom,
    }
  } else {
    return {
      center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
      zoom: DEFAULT_ZOOM,
    }
  }
}

export const getEntry = () => {
  const url = window.location.href
  if (url.indexOf('/entry/') === -1) {
    return null
  }
  return url.substring(url.indexOf(/entry/) + 7, url.indexOf('/@'))
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
