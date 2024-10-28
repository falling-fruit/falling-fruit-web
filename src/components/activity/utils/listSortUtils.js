const formatDate = (date) => {
  const parsedDate = new Date(date)
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = parsedDate.getFullYear()

  return `${day}-${month}-${year}`
}

const getDaysDifference = (date1, date2) => {
  const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  const timeDiff = day1.getTime() - day2.getTime()
  return Math.floor(timeDiff / (1000 * 3600 * 24))
}

export const groupChangesByDate = (changes) => {
  const today = new Date()

  const groups = {}

  changes.forEach((change) => {
    const changeDate = new Date(change.created_at)
    const daysAgo = getDaysDifference(today, changeDate)

    let periodName
    if (daysAgo === 0) {
      periodName = 'Today'
    } else if (daysAgo === 1) {
      periodName = 'Yesterday'
    } else {
      periodName = formatDate(changeDate)
    }

    if (!groups[periodName]) {
      groups[periodName] = []
    }
    groups[periodName].push(change)
  })

  return groups
}
