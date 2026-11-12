const RESOLUTION_NO_CHANGES = 0
export const RESOLUTION_EDIT_LOCATION = 1
const RESOLUTION_DELETE_LOCATION = 2
export const RESOLUTION_DELETE_PHOTO = 3
export const RESOLUTION_DELETE_REVIEW = 4

export const SINGLE_LOCATION_RESOLUTION_CODES = [
  RESOLUTION_EDIT_LOCATION,
  RESOLUTION_DELETE_PHOTO,
  RESOLUTION_DELETE_REVIEW,
]

const PROBLEM_CODE_SPAM = 0
const PROBLEM_CODE_DOES_NOT_EXIST = 1
const PROBLEM_CODE_BAD_PHOTO = 3
const PROBLEM_CODE_BAD_COMMENT = 4

const PROBLEM_CODE_TO_RESOLUTION = {
  [PROBLEM_CODE_SPAM]: RESOLUTION_DELETE_LOCATION,
  [PROBLEM_CODE_DOES_NOT_EXIST]: RESOLUTION_DELETE_LOCATION,
  [PROBLEM_CODE_BAD_PHOTO]: RESOLUTION_DELETE_PHOTO,
  [PROBLEM_CODE_BAD_COMMENT]: RESOLUTION_DELETE_REVIEW,
}

export const presetResolutionCode = (reports, { singleLocation }) => {
  if (!reports || reports.length === 0) {
    return null
  }
  const problemCodes = new Set(reports.map((report) => report.problem_code))
  if (problemCodes.size !== 1) {
    return null
  }
  const [problemCode] = [...problemCodes]
  const presetCode = PROBLEM_CODE_TO_RESOLUTION[problemCode]
  if (presetCode == null) {
    return null
  }
  if (
    !singleLocation &&
    SINGLE_LOCATION_RESOLUTION_CODES.includes(presetCode)
  ) {
    return null
  }
  return presetCode
}

const emptyToNull = (value) => (value === '' || value == null ? null : value)

export const buildResolutionAction = ({
  code,
  response,
  photoId,
  reviewIds,
  editAttested,
}) => {
  if (code == null) {
    return null
  }

  const base = { code, response: emptyToNull(response) }

  switch (code) {
    case RESOLUTION_EDIT_LOCATION:
      return editAttested ? { ...base, code: RESOLUTION_NO_CHANGES } : null
    case RESOLUTION_DELETE_PHOTO:
      return { ...base, photo_id: photoId }
    case RESOLUTION_DELETE_REVIEW:
      return { ...base, review_ids: reviewIds ?? [] }
    default:
      return base
  }
}

export const isResolutionActionReady = (resolution) => {
  if (!resolution) {
    return false
  }
  switch (resolution.code) {
    case RESOLUTION_DELETE_PHOTO:
      return resolution.photo_id != null
    case RESOLUTION_DELETE_REVIEW:
      return (resolution.review_ids?.length ?? 0) > 0
    default:
      return true
  }
}

export const uniqueLocations = (reports) => {
  const locationsById = new Map()
  reports.forEach((report) => {
    const key = report.location?.id ?? `deleted-${report.id}`
    if (!locationsById.has(key)) {
      locationsById.set(key, {
        key,
        locationId: report.location?.id ?? null,
        location: report.location,
      })
    }
  })
  return [...locationsById.values()]
}

export const tristateChecked = (selectedCount, total) => {
  if (total === 0 || selectedCount === 0) {
    return false
  }
  return selectedCount === total ? true : 'mixed'
}

export const reporterKey = (reporter) => {
  if (reporter?.user_id != null) {
    return `user-${reporter.user_id}`
  }
  if (reporter?.email != null) {
    return `email-${reporter.email}`
  }
  if (reporter?.name != null) {
    return `name-${reporter.name}`
  }
  return null
}

export const reporterName = (reporter) => reporter?.name || null
