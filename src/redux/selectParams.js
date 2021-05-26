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
  bounds: `${bounds.sw.lat},${normalizeLongitude(bounds.sw.lng)}|${
    bounds.ne.lat
  },${normalizeLongitude(bounds.ne.lng)}`,
})

const convertCenter = (center) => ({
  center: `${center.lat},${center.lng}`,
})

export const selectParams = (
  state,
  extraParams = {},
  includeCenter = false,
) => {
  const { types, muni } = state.filter
  const { view } = state.map

  const params = {
    types: types.join(','),
    muni,
    ...convertBounds(view.bounds),
    ...(includeCenter && convertCenter(view.center)),
    ...extraParams,
  }

  return params
}
