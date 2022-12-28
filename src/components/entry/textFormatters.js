import { MONTH_LABELS } from '../form/LocationForm'

/**
 * Helper function to convert ISO date string into "month date, year" format.
 * @param {string} dateString - The ISO date to convert
 */
export const formatISOString = (dateString, language) =>
  new Date(dateString).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const ACCESS_TYPE = {
  0: "On lister's property",
  1: 'Received permission from owner',
  2: 'Public property',
  3: 'Private but overhanging',
  4: 'Private property',
}

export const formatSeasonality = (startMonth, endMonth, noSeason) => {
  if (noSeason || (startMonth === 0 && endMonth === 11)) {
    return 'Year Round'
  }
  return `In season from ${MONTH_LABELS[startMonth] || '?'} to ${
    MONTH_LABELS[endMonth] || '?'
  }`
}
