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

export const formatMonth = (month, language) =>
  new Date(1, month, 1)
    .toLocaleDateString(language, { month: 'long' })
    .replace(/^\w/, (c) => c.toUpperCase())

export const ACCESS_TYPE = {
  0: "On lister's property",
  1: 'Received permission from owner',
  2: 'Public property',
  3: 'Private but overhanging',
  4: 'Private property',
}
