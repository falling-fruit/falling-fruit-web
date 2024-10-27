import { getGeocode } from 'use-places-autocomplete'

export const getZoomedInView = (locationLat, locationLng, lastMapView) => {
  const center = { lat: locationLat, lng: locationLng }
  const zoom = 17
  const bounds = getBoundsForScreenSize(
    center,
    zoom,
    lastMapView.width,
    lastMapView.height,
  )

  return {
    location: {
      lat: locationLat,
      lng: locationLng,
      description: `${locationLat}, ${locationLng}`,
    },
    view: { bounds, center, zoom },
  }
}

const WORLD_DIM = { height: 256, width: 256 } // tile size
const ZOOM_MAX = 21 // max zoom level in Google Maps

const latRad = (lat) => {
  const sin = Math.sin((lat * Math.PI) / 180)
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
}

const getZoom = (north, east, south, west, height, width) => {
  const northRad = latRad(north)
  const southRad = latRad(south)
  const latFraction = Math.abs(northRad - southRad) / Math.PI

  let lngDiff = east - west
  if (lngDiff < -180) {
    lngDiff += 360
  }
  if (lngDiff > 180) {
    lngDiff -= 360
  }
  const lngFraction = Math.abs(lngDiff) / 360

  if (latFraction === 0 || lngFraction === 0) {
    return 12 // Avoid division by zero error
  }

  const latZoom = Math.floor(
    Math.log(height / WORLD_DIM.height / latFraction) / Math.LN2,
  )
  const lngZoom = Math.floor(
    Math.log(width / WORLD_DIM.width / lngFraction) / Math.LN2,
  )

  return Math.min(Math.max(1, Math.min(latZoom, lngZoom)), ZOOM_MAX)
}

const EARTH_RADIUS = 6378137
const MAX_LATITUDE = 85.0511287798

export const getPlaceBounds = async (description, placeId, lastMapView) => {
  const results = await getGeocode({ placeId })
  const {
    geometry: { viewport, location },
  } = results[0]

  const [ne, sw] = [viewport.getNorthEast(), viewport.getSouthWest()]

  const mercatorNE = latLngToMercator(ne.lat(), ne.lng())
  const mercatorSW = latLngToMercator(sw.lat(), sw.lng())
  const mercatorCenter = {
    x: (mercatorNE.x + mercatorSW.x) / 2,
    y: (mercatorNE.y + mercatorSW.y) / 2,
  }

  const center = mercatorToLatLng(mercatorCenter.x, mercatorCenter.y)
  const zoom = getZoom(
    ne.lat(),
    ne.lng(),
    sw.lat(),
    sw.lng(),
    lastMapView.height,
    lastMapView.width,
  )
  const bounds = getBoundsForScreenSize(
    center,
    zoom,
    lastMapView.width,
    lastMapView.height,
  )

  return {
    location: {
      lat: location.lat(),
      lng: location.lng(),
      description,
    },
    view: { bounds, center, zoom },
  }
}

const latLngToMercator = (lat, lng) => {
  const x = (lng * EARTH_RADIUS * Math.PI) / 180
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) * EARTH_RADIUS
  y = Math.max(
    -MAX_LATITUDE * EARTH_RADIUS,
    Math.min(y, MAX_LATITUDE * EARTH_RADIUS),
  )
  return { x, y }
}

const mercatorToLatLng = (x, y) => {
  const lng = (x * 180) / (EARTH_RADIUS * Math.PI)
  const lat =
    ((2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2) * 180) / Math.PI
  return { lat, lng }
}

const getBoundsForScreenSize = (center, zoom, width, height) => {
  const scale = Math.pow(2, zoom)
  const worldCoordinateCenter = project(center)

  const pixelCoordinate = {
    x: worldCoordinateCenter.x * scale,
    y: worldCoordinateCenter.y * scale,
  }

  const halfWidthInPixels = width / 2
  const halfHeightInPixels = height / 2

  const newNorthEast = unproject({
    x: (pixelCoordinate.x + halfWidthInPixels) / scale,
    y: (pixelCoordinate.y - halfHeightInPixels) / scale,
  })

  const newSouthWest = unproject({
    x: (pixelCoordinate.x - halfWidthInPixels) / scale,
    y: (pixelCoordinate.y + halfHeightInPixels) / scale,
  })

  return {
    south: newSouthWest.lat,
    west: newSouthWest.lng,
    north: newNorthEast.lat,
    east: newNorthEast.lng,
  }
}

const project = ({ lat, lng }) => {
  const TILE_SIZE = 256
  const siny = Math.sin((lat * Math.PI) / 180)
  const x = TILE_SIZE * (0.5 + lng / 360)
  const y =
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  return { x, y }
}

const unproject = ({ x, y }) => {
  const TILE_SIZE = 256
  const lng = (x / TILE_SIZE - 0.5) * 360
  const latRadians = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / TILE_SIZE)))
  const lat = latRadians * (180 / Math.PI)
  return { lat, lng }
}
