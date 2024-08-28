export const INITIAL_REVIEW_VALUES = {
  review: {
    photos: [],
    comment: '',
    observed_on: '',
    fruiting: null,
    quality_rating: '0',
    yield_rating: '0',
  },
}

export const FRUITING_OPTIONS = ['Flowers', 'Unripe fruit', 'Ripe fruit'].map(
  (name, idx) => ({
    label: name,
    value: idx,
  }),
)
const PROPERTY_ACCESS_LABELS = [
  'Source is on my property',
  'I have permission from the owner to add the source',
  'Source is on public land',
  'Source is on private property but overhangs public land',
  'Source is on private property (ask before you pick)',
]

export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const labelsToOptions = (labels) =>
  labels.map((label, index) => ({
    label,
    value: index,
  }))

export const PROPERTY_ACCESS_OPTIONS = labelsToOptions(PROPERTY_ACCESS_LABELS)

export const MONTH_OPTIONS = labelsToOptions(MONTH_LABELS)

export const INITIAL_LOCATION_VALUES = {
  types: [],
  description: '',
  access: null,
  season_start: null,
  season_stop: null,
  ...INITIAL_REVIEW_VALUES,
}
