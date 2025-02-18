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

// AI generated
const UPPERCASE_MONTH_LANGUAGES = ['en', 'de', 'nl', 'fr', 'it', 'es', 'pt-br']

export const formatMonth = (month, language) => {
  const monthName = new Date(1, month, 1).toLocaleDateString(language, {
    month: 'long',
  })
  return UPPERCASE_MONTH_LANGUAGES.includes(language.toLowerCase())
    ? monthName.replace(/^\w/, (c) => c.toUpperCase())
    : monthName
}
