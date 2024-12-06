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

export const INITIAL_LOCATION_VALUES = {
  types: [],
  description: '',
  access: null,
  season_start: null,
  season_stop: null,
  ...INITIAL_REVIEW_VALUES,
}
