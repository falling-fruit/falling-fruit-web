import { useCallback } from 'react'

import { useMap } from '../contexts/MapContext'
import { useSearch } from '../contexts/SearchContext'

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

export const useFilteredParams = () => {
  const { filters } = useSearch()
  const { view: mapView } = useMap()

  const getFilteredParams = useCallback(
    (params = {}, includeCenter = false, view = mapView) => ({
      types: filters.types.join(','),
      muni: filters.muni,
      ...convertBounds(view.bounds),
      ...(includeCenter && convertCenter(view.center)),
      ...params,
    }),
    [filters, mapView],
  )

  return getFilteredParams
}
