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
      ne: { lat: locationLat + BOUND_DELTA, lng: locationLng + BOUND_DELTA },
      sw: { lat: locationLat - BOUND_DELTA, lng: locationLng - BOUND_DELTA },
    },
  })

export const getPlaceBoundsOld = async (description, placeId, lastMapView) => {
  const results = await getGeocode({ placeId })
  const {
    geometry: { viewport, location },
  } = results[0]

  const [ne, sw] = [viewport.getNorthEast(), viewport.getSouthWest()]

  const proposedZoom = getZoom(
    ne.lat(),
    ne.lng(),
    sw.lat(),
    sw.lng(),
    lastMapView.height,
    lastMapView.width,
  )
  const proposedCenter = {
    lat: (ne.lat() + sw.lat()) / 2,
    lng: (ne.lng() + sw.lng()) / 2,
  }

  const proposedBounds = getProposedBounds(
    proposedCenter,
    proposedZoom,
    lastMapView.width,
    lastMapView.height,
  )

  console.log({ proposedZoom, proposedCenter, proposedBounds })

  return {
    location: {
      lat: location.lat(),
      lng: location.lng(),
      description,
    },
    viewport: {
      ne: { lat: ne.lat(), lng: ne.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
    },
    fallbackView: {
      zoom: proposedZoom,
      center: proposedCenter,
      bounds: proposedBounds,
      width: lastMapView.width,
      height: lastMapView.height,
    },
  }
}

// AI generated
const WORLD_DIM = { height: 256, width: 256 } // tile size
const ZOOM_MAX = 21 // max zoom level in Google Maps

const latRad = (lat) => {
  const sin = Math.sin((lat * Math.PI) / 180)
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
}

const getZoom = (neLat, neLng, swLat, swLng, height, width) => {
  console.log('getZoom inputs:', { neLat, neLng, swLat, swLng, height, width })

  // Ensure inputs are numbers and not undefined
  if (
    [neLat, neLng, swLat, swLng, height, width].some(
      (val) => typeof val !== 'number' || isNaN(val),
    )
  ) {
    console.error('Invalid inputs to getZoom')
    return 12 // Default zoom level
  }

  // Calculate latitude fraction
  const neLatRad = latRad(neLat)
  const swLatRad = latRad(swLat)
  const latFraction = Math.abs(neLatRad - swLatRad) / Math.PI
  console.log('Lat calculations:', { neLatRad, swLatRad, latFraction })

  // Calculate longitude fraction
  let lngDiff = neLng - swLng
  // Normalize longitude difference
  if (lngDiff < -180) {lngDiff += 360}
  if (lngDiff > 180) {lngDiff -= 360}
  const lngFraction = Math.abs(lngDiff) / 360
  console.log('Lng calculations:', { lngDiff, lngFraction })

  // Prevent division by zero
  if (latFraction === 0 || lngFraction === 0) {
    console.warn('Zero fraction detected')
    return 12 // Default zoom level
  }

  const latZoom = Math.floor(
    Math.log(height / WORLD_DIM.height / latFraction) / Math.LN2,
  )
  const lngZoom = Math.floor(
    Math.log(width / WORLD_DIM.width / lngFraction) / Math.LN2,
  )

  console.log('Zoom calculations:', { latZoom, lngZoom })

  const finalZoom = Math.min(Math.max(1, Math.min(latZoom, lngZoom)), ZOOM_MAX)
  console.log('Final zoom:', finalZoom)

  return finalZoom
}

const getProposedBounds = (center, zoom, width, height) => {
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
    ne: { lat: newNorthEast.lat, lng: newNorthEast.lng },
    sw: { lat: newSouthWest.lat, lng: newSouthWest.lng },
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

  // New implementation
  const newFallback = {
    view: {
      bounds: {
        ne: { lat: adjustedNE.lat, lng: adjustedNE.lng },
        sw: { lat: adjustedSW.lat, lng: adjustedSW.lng },
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

  const proposedZoom = getZoom(ne, sw, lastMapView.height, lastMapView.width)
  const proposedCenter = {
    lat: (ne.lat() + sw.lat()) / 2,
    lng: (ne.lng() + sw.lng()) / 2,
  }

  const proposedBounds = getProposedBounds(
    proposedCenter,
    proposedZoom,
    lastMapView.width,
    lastMapView.height,
  )

  const oldFallback = {
    view: {
      zoom: proposedZoom,
      center: proposedCenter,
      bounds: proposedBounds,
      width: lastMapView.width,
      height: lastMapView.height,
    },
  }

  return {
    location: {
      lat: location.lat(),
      lng: location.lng(),
      description,
    },
    viewport: {
      ne: { lat: ne.lat(), lng: ne.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
    },
    ...oldFallback,
    newFallback,
    oldFallback,
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
