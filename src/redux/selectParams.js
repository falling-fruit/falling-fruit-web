/**
 * Normalize longitude to range [-180, 180].
 *
 * @param {number} longitude Longitude in degrees.
 * @returns Longitude in degrees in the range [-180, 180].
 */
const normalizeLongitude = (longitude) => {
  while (longitude < -180) {
    longitude += 360
  }
  while (longitude > 180) {
    longitude -= 360
  }
  return longitude
}

const convertBounds = (bounds) => ({
  bounds: `${bounds.south},${normalizeLongitude(bounds.west)}|${
    bounds.north
  },${normalizeLongitude(bounds.east)}`,
})

const convertCenter = (center) => ({
  center: `${center.lat},${center.lng}`,
})

export const selectParams = (
  { types, muni, invasive, bounds, zoom, center },
  extraParams = {},
) => ({
  types: types && types.join(','),
  muni,
  invasive,
  zoom,
  ...convertBounds(bounds),
  ...convertCenter(center),
  ...extraParams,
})
