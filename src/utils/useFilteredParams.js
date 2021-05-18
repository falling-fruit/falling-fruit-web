import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

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
  nelat: bounds.ne.lat,
  nelng: normalizeLongitude(bounds.ne.lng),
  swlat: bounds.sw.lat,
  swlng: normalizeLongitude(bounds.sw.lng),
})

const convertCenter = (center) => ({
  lng: center.lng,
  lat: center.lat,
})

export const useFilteredParams = () => {
  const { i18n } = useTranslation()
  const { filters } = useSearch()
  const { view: mapView } = useMap()

  const getFilteredParams = useCallback(
    (params = {}, includeCenter = false, view = mapView) => ({
      muni: filters.muni ? 1 : 0,
      t: filters.types.toString(),
      invasive: filters.invasive ? 1 : 0,
      locale: i18n.language === 'en-US' ? 'en' : i18n.language,
      ...convertBounds(view.bounds),
      ...(includeCenter ? convertCenter(view.center) : {}),
      ...params,
    }),
    [filters, i18n.language, mapView],
  )

  return getFilteredParams
}
