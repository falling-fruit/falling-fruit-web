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

export const selectParams = (state, extraParams = {}, isMap = true) => {
  const { types, muni, invasive } = state.filter
  const { view } = isMap ? state.map : state.list

  const params = {
    types: types && types.join(','),
    muni,
    invasive,
    ...convertBounds(view.bounds),
    ...(!isMap && convertCenter(view.center)),
    ...extraParams,
  }

  return params
}
