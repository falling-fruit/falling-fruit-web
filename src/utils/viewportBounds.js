import { getGeocode } from 'use-places-autocomplete'

const BOUND_DELTA = 0.001

export const getZoomedInView = (locationLat, locationLng) =>
  // Use fixed zoom level locationed at lat and long
  ({
    location: {
      lat: locationLat,
      lng: locationLng,
      description: `${locationLat}, ${locationLng}`,
    },
    viewport: {
      north: locationLat + BOUND_DELTA,
      south: locationLat - BOUND_DELTA,
      east: locationLng + BOUND_DELTA,
      west: locationLng - BOUND_DELTA,
    },
  })

// AI generated
const WORLD_DIM = { height: 256, width: 256 } // tile size
const ZOOM_MAX = 21 // max zoom level in Google Maps

const latRad = (lat) => {
  const sin = Math.sin((lat * Math.PI) / 180)
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
}

const getZoom = (north, east, south, west, height, width) => {
  if (
    [north, east, south, west, height, width].some(
      (val) => typeof val !== 'number' || isNaN(val),
    )
  ) {
    return 12 // Default zoom level
  }

  const northRad = latRad(north)
  const southRad = latRad(south)
  const latFraction = Math.abs(northRad - southRad) / Math.PI

  let lngDiff = east - west
  if (lngDiff < -180) {lngDiff += 360}
  if (lngDiff > 180) {lngDiff -= 360}
  const lngFraction = Math.abs(lngDiff) / 360

  if (latFraction === 0 || lngFraction === 0) {
    return 12 // Default zoom level
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

  const aspectRatio = lastMapView.width / lastMapView.height
  const padding = 0.1 // 10% padding

  const mercatorWidth = mercatorNE.x - mercatorSW.x
  const mercatorHeight = mercatorSW.y - mercatorNE.y

  let adjustedMercatorWidth = mercatorWidth * (1 + padding)
  let adjustedMercatorHeight = mercatorHeight * (1 + padding)

  if (adjustedMercatorWidth / adjustedMercatorHeight > aspectRatio) {
    adjustedMercatorHeight = adjustedMercatorWidth / aspectRatio
  } else {
    adjustedMercatorWidth = adjustedMercatorHeight * aspectRatio
  }

  const mercatorCenter = {
    x: (mercatorNE.x + mercatorSW.x) / 2,
    y: (mercatorNE.y + mercatorSW.y) / 2,
  }

  const adjustedMercatorNE = {
    x: mercatorCenter.x + adjustedMercatorWidth / 2,
    y: mercatorCenter.y - adjustedMercatorHeight / 2,
  }

  const adjustedMercatorSW = {
    x: mercatorCenter.x - adjustedMercatorWidth / 2,
    y: mercatorCenter.y + adjustedMercatorHeight / 2,
  }

  const adjustedNE = mercatorToLatLng(
    adjustedMercatorNE.x,
    adjustedMercatorNE.y,
  )
  const adjustedSW = mercatorToLatLng(
    adjustedMercatorSW.x,
    adjustedMercatorSW.y,
  )
  const center = mercatorToLatLng(mercatorCenter.x, mercatorCenter.y)

  return {
    location: {
      lat: location.lat(),
      lng: location.lng(),
      description,
    },
    view: {
      bounds: {
        north: adjustedNE.lat,
        south: adjustedSW.lat,
        east: adjustedNE.lng,
        west: adjustedSW.lng,
      },
      center: { lat: center.lat, lng: center.lng },
      zoom: getZoom(
        adjustedNE.lat,
        adjustedNE.lng,
        adjustedSW.lat,
        adjustedSW.lng,
        lastMapView.height,
        lastMapView.width,
      ),
    },
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
