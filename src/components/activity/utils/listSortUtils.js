export const timePeriods = [
  { name: 'Today', condition: (daysAgo) => daysAgo === 0 },
  { name: 'Yesterday', condition: (daysAgo) => daysAgo === 1 },
  { name: '2 Days Ago', condition: (daysAgo) => daysAgo === 2 },
  { name: '3 Days Ago', condition: (daysAgo) => daysAgo === 3 },
  { name: 'This Week', condition: (daysAgo) => daysAgo <= 7 },
  { name: 'Last Week', condition: (daysAgo) => daysAgo <= 14 },
  { name: '2 Weeks Ago', condition: (daysAgo) => daysAgo <= 21 },
  { name: '3 Weeks Ago', condition: (daysAgo) => daysAgo <= 28 },
  { name: 'This Month', condition: (daysAgo) => daysAgo <= 30 },
  { name: 'Last Month', condition: (daysAgo) => daysAgo <= 60 },
  { name: 'Three Months Ago', condition: (daysAgo) => daysAgo <= 90 },
  { name: 'Six Months Ago', condition: (daysAgo) => daysAgo <= 180 },
  { name: 'One Year Ago', condition: (daysAgo) => daysAgo <= 365 },
  { name: 'More Than a Year', condition: (daysAgo) => daysAgo > 365 },
]

const getDaysDifference = (date1, date2) => {
  const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  const timeDiff = day1.getTime() - day2.getTime()
  return Math.floor(timeDiff / (1000 * 3600 * 24))
}

export const groupChangesByDate = (changes) => {
  const today = new Date()

  const groups = timePeriods.reduce((acc, period) => {
    acc[period.name] = []
    return acc
  }, {})

  changes.forEach((change) => {
    const changeDate = new Date(change.created_at)
    const daysAgo = getDaysDifference(today, changeDate)

    const period = timePeriods.find((period) => period.condition(daysAgo))
    if (period) {
      groups[period.name].push(change)
    }
  })

  return groups
}
