import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { addReview } from '../../utils/api'
import { FormRatingWrapper } from '../auth/AuthWrappers'
import { arePhotosUploaded } from '../photo/PhotoUploader'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import FormikAllSteps from './FormikAllSteps'
import {
  DateInput,
  PhotoUploader,
  RatingInput,
  Select,
  Textarea,
} from './FormikWrappers'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

export const INITIAL_REVIEW_VALUES = {
  review: {
    photos: [],
    comment: '',
    observed_on: '',
    fruiting: 0,
    quality_rating: 0,
    yield_rating: 0,
  },
}

export const isEmptyReview = (review) => {
  const r = formatReviewValues(review)
  return (
    !r.comment &&
    !r.observed_on &&
    r.fruiting === 0 &&
    r.quality_rating === 0 &&
    r.yield_rating === 0 &&
    r.photo_ids.length === 0
  )
}

export const validateReview = (review) => {
  if (isEmptyReview(review)) {
    return {
      review: { comment: true },
    }
  }

  if (!arePhotosUploaded(review.photos)) {
    return {
      review: { photos: true },
    }
  }

  const r = formatReviewValues(review)
  if (r.fruiting !== 0 && r.observed_on === '') {
    return {
      review: { observed_on: true },
    }
  }

  return null
}

export const formatReviewValues = (review) => {
  const formattedReview = {
    ...review,
    fruiting: review.fruiting?.value ?? 0,
    quality_rating: Number(review.quality_rating),
    yield_rating: Number(review.yield_rating),
    photo_ids: review.photos.map((photo) => photo.id),
  }
  delete formattedReview.photos
  return formattedReview
}

export const ReviewStep = ({ standalone }) => (
  <>
    <SectionHeading>
      Leave a Review
      {!standalone && <Optional />}
    </SectionHeading>

    <Textarea
      name="review.comment"
      placeholder="Updates, access issues, plant health..."
    />

    <DateInput name="review.observed_on" label="Observed On" />

    <Select
      label="Fruiting Status"
      name="review.fruiting"
      /* TODO: Create a generic utility to build form options */
      options={['Flowers', 'Unripe fruit', 'Ripe fruit'].map((name, idx) => ({
        label: name,
        value: idx + 1,
      }))}
      isClearable
    />

    <FormRatingWrapper>
      <LabeledRow
        label={<label htmlFor="review.quality_rating-group">Quality</label>}
        right={
          <RatingInput name="review.quality_rating" label="Quality" total={5} />
        }
      />
      <LabeledRow
        label={<label htmlFor="review.yield_rating-group">Yield</label>}
        right={
          <RatingInput name="review.yield_rating" label="Yield" total={5} />
        }
      />
    </FormRatingWrapper>
  </>
)

export const ReviewPhotoStep = () => (
  <PhotoUploader name="review.photos" label="Upload Images" optional />
)

export const ReviewForm = ({ onSubmit }) => {
  const { id: locationId } = useParams()
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const handleSubmit = async (
    { 'g-recaptcha-response': recaptcha, review },
    { resetForm },
  ) => {
    const reviewValues = {
      ...formatReviewValues(review),
      'g-recaptcha-response': recaptcha,
    }

    let response
    try {
      response = await addReview(locationId, reviewValues)
      toast.success('Review submitted successfully!')
    } catch {
      toast.error('Review submission failed.')
      console.error(response)
    }

    if (response && !response.error) {
      onSubmit(response)
      resetForm()
    }
  }

  const { Recaptcha, handlePresubmit } = useInvisibleRecaptcha(handleSubmit)

  return (
    <FormikAllSteps
      onSubmit={isLoggedIn ? handleSubmit : handlePresubmit}
      initialValues={INITIAL_REVIEW_VALUES}
      validate={({ review }) => validateReview(review)}
      renderButtons={({ isSubmitting, isValid }) => (
        <Button disabled={isSubmitting || !isValid} type="submit">
          {isSubmitting ? 'Publishing' : 'Publish Review'}
        </Button>
      )}
    >
      <ReviewStep standalone />
      <ReviewPhotoStep />
      {!isLoggedIn && <Recaptcha />}
    </FormikAllSteps>
  )
}
