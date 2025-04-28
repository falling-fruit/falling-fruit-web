/**
 * Helper function to convert ISO date string into "month date, year" format.
 * @param {string} dateString - The ISO date to convert
 * @param {string} language - The language code to use for formatting
 */
export const formatISOString = (dateString, language) =>
  new Date(dateString).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const formatMonth = (month, language) =>
  new Date(1, month).toLocaleDateString(language, {
    month: 'long',
  })

export const formatMonthList = (months, language) => {
  if (!months.length) {
    return null
  }

  const monthCounts = months.reduce((acc, month) => {
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  return Object.entries(monthCounts)
    .map(([month, count]) => {
      const monthStr = formatMonth(parseInt(month), language)
      return `${monthStr} (${count})`
    })
    .join(' · ')
}
