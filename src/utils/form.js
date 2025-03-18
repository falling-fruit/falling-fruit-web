export const isEmptyReview = (review) => {
  if (!review) {
    return true
  }

  const r = formToReview(review)
  return (
    !r.comment &&
    r.quality_rating === null &&
    r.fruiting === null &&
    r.yield_rating === null &&
    r.photo_ids.length === 0
  )
}

const validateReviewStep = (review) => {
  const r = formToReview(review)
  if (r.fruiting !== null && !r.observed_on) {
    return {
      review: { observed_on: true },
    }
  }

  return null
}

const validatePhotosUploaded = (review) => {
  if (!isEveryPhotoUploaded(review.photos)) {
    return {
      review: { photos: true },
    }
  }

  return null
}

export const validateReview = (review) => ({
  ...validatePhotosUploaded(review),
  ...validateReviewStep(review),
})

export const formToReview = (review) => {
  const formattedReview = {
    ...review,
    comment: review.comment || null,
    observed_on: review.observed_on || null,
    fruiting: review.fruiting || null,
    quality_rating:
      review.quality_rating === '0' ? null : Number(review.quality_rating) - 1,
    yield_rating:
      review.yield_rating === '0' ? null : Number(review.yield_rating) - 1,
    photo_ids: review.photos.map((photo) => photo.id),
  }
  delete formattedReview.photos
  return formattedReview
}

export const reviewToForm = ({
  comment,
  photos,
  observed_on,
  fruiting,
  yield_rating,
  quality_rating,
}) => ({
  comment: comment ?? '',
  photos: photos.map((photo) => ({
    id: photo.id,
    name: `My Photo ${photo.created_at.split('T')[0]}`,
    image: photo.thumb,
    isNew: false,
  })),
  observed_on: observed_on ?? '',
  fruiting: fruiting,
  yield_rating: yield_rating === null ? '0' : String(yield_rating + 1),
  quality_rating: quality_rating === null ? '0' : String(quality_rating + 1),
})

const isEveryPhotoUploaded = (photos) =>
  photos.every((photo) => !photo.isUploading)

export const validateLocation = ({ review, ...location }) => {
  const errors = {}
  if (location.types.length === 0) {
    errors.types = true
  }

  if (!isEmptyReview(review)) {
    Object.assign(errors, validateReview(review))
  }

  return errors
}

export const formToLocation = ({
  types,
  description,
  season_start,
  season_stop,
  access,
  unverified,
  position: { lat, lng },
}) => ({
  type_ids: types.map(({ value }) => value),
  description,
  season_start: season_start ?? null,
  season_stop: season_stop ?? null,
  access: access ?? null,
  unverified,
  lat,
  lng,
})

export const locationToForm = (
  { type_ids, description, season_start, season_stop, access, unverified },
  typesAccess,
) => ({
  types: type_ids?.map((id) => {
    const type = typesAccess.getType(id)
    return {
      ...type,
      value: id,
    }
  }),
  description,
  season_start,
  season_stop,
  access,
  unverified,
})

export const isTooClose = (location, existingLocations, editingId) => {
  /*
   * display-based threshold where a dot half-overlaps another at the max zoom level
   * Given the (2 x pi x Earth radius) / (256 pixels x 2^zoom) = 0.0373 meters / pixel ratio of the Web Mercator projection at zoom level 22,
   * and a pixel half-width of 8 pixels, that is a threshold of 0.3 m
   * i.e. xDiff < 0.3 && yDiff < 0.3 (for Web Mercator x, y coordinates)
   * or roughly latDiff < 0.27e-5 && lngDiff < 0.27e-5
   */
  if (!location || !existingLocations || existingLocations.length === 0) {
    return false
  }

  return existingLocations.some((existingLocation) => {
    if (editingId && editingId === existingLocation.id) {
      return false
    } else {
      const latDiff = Math.abs(existingLocation.lat - location.lat)
      const lngDiff = Math.abs(existingLocation.lng - location.lng)
      return latDiff < 0.27e-5 && lngDiff < 0.27e-5
    }
  })
}
