const getHoursDifference = (date1, date2) => {
  const timeDiff = date1.getTime() - date2.getTime()
  return Math.floor(timeDiff / (1000 * 3600))
}

export const groupChangesByDate = (changes) => {
  const now = new Date()

  const groups = {}

  changes.forEach((change) => {
    const changeDate = new Date(change.created_at)
    const hoursAgo = getHoursDifference(now, changeDate)

    let periodName
    if (hoursAgo < 24) {
      periodName = 'Last 24 Hours'
    } else if (hoursAgo < 48) {
      periodName = '1 Day Ago'
    } else {
      const daysAgo = Math.floor(hoursAgo / 24)
      periodName = `${daysAgo} Days Ago`
    }

    if (!groups[periodName]) {
      groups[periodName] = []
    }
    groups[periodName].push(change)
  })

  return groups
}
