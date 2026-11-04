export const PROBLEM_TYPE_LABELS = [
  'Location is spam',
  'Location does not exist',
  'Location is a duplicate',
  'Inappropriate review photo',
  'Inappropriate review comment',
  'Other',
]

export const problemTypeLabel = (code) =>
  PROBLEM_TYPE_LABELS[code] ?? `Problem ${code}`

export const RESOLUTION_CODE_LABELS = [
  'Make no changes',
  'Edit the location',
  'Delete the location',
  'Delete the photo',
  'Delete the review',
  'Hide the location',
]

export const resolutionCodeLabel = (code) =>
  RESOLUTION_CODE_LABELS[code] ?? `Resolution ${code}`

export const adminStrings = {
  header: 'Admin',
  openReports: 'Open reports',
  resolvedReports: 'Resolved reports',

  reports: {
    openTitle: 'Open reports',
    resolvedTitle: 'Resolved reports',
    id: 'ID',
    openCount: (count) => `${count} open report${count === 1 ? '' : 's'}`,
    groupBy: 'Group by',
    groupByLocation: 'Location',
    groupByReporter: 'Reporter',
    groupByProblem: 'Problem type',
    groupByDate: 'Date',
    groupByNone: 'None',
    all: 'All',
    searchPlaceholder: 'Search reports',
    location: 'Location',
    reporter: 'Reporter',
    problem: 'Problem',
    problemType: 'Problem type',
    problemDetails: 'Problem details',
    date: 'Date',
    resolution: 'Resolution',
    responder: 'Resolved by',
    resolvedOn: 'Resolved',
    anonymous: 'Anonymous',
    deletedLocation: 'Deleted location',
    emptyOpen: 'There are no open reports.',
    emptyResolved: 'There are no resolved reports.',
    resolvedSearchPlaceholder: 'Search resolved reports',
    filterByProblem: 'Problem type',
    filterByResolution: 'Resolution',
    sortBy: 'Sort by',
    sortNewest: 'Most recently resolved',
    sortOldest: 'Least recently resolved',
  },

  resolve: {
    resolutionCodeLabel: 'Resolution',
    responseLabel: 'Resolution comment',
    responsePlaceholder: 'Additional details for the reporter',
    notifyReporters: 'Notify reporters by email',
    submit: 'Resolve reports',
    failure: (message) => `Failed to resolve reports: ${message}`,
    resolved: (emails) => {
      const sent = emails?.sent ?? []
      const failed = emails?.failed ?? []
      const lines = ['Reports resolved successfully!']

      if (sent.length) {
        lines.push(`Emailed: ${sent.join(', ')}`)
      }

      if (failed.length) {
        lines.push(
          'Some notification emails could not be sent:',
          ...failed.map(({ email, error }) => `• ${email}: ${error}`),
        )
      }

      return lines.join('\n')
    },
    editLocationLabel: 'Edit the location',
    editAttestation: 'I have edited the location',
    editLocationLink: 'Open the location edit form in a new tab',
    selectPhoto: 'Select the photo to delete',
    noPhotos: 'This location has no photos.',
    selectReview: 'Select the review to delete',
    noReviews: 'This location has no reviews.',
    selectReports: 'Select reports to resolve',
    selectAll: 'Select all reports',
    emptySelectionHint:
      'Select one or more reports above to choose how to resolve them.',
    multiLocationNote:
      'The selected reports span multiple locations. Only dismiss, delete, and hide can be applied across locations. Select reports from a single location to edit it or delete a photo or review.',
    relatedReportsWarning: (count) =>
      `${count} other open report${count === 1 ? '' : 's'} for ${count === 1 ? 'this location' : 'these locations'} ${count === 1 ? 'is' : 'are'} not included:`,
    addRelatedReport: 'add',
  },
}
