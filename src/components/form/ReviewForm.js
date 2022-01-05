import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { addReview } from '../../utils/api'
import { arePhotosUploaded } from '../photo/PhotoUploader'
import Button from '../ui/Button'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import FormikAllSteps from './FormikAllSteps'
import { DateInput, PhotoUploader, Slider, Textarea } from './FormikWrappers'
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

export const isEmptyReview = (review) =>
  !review.comment &&
  review.fruiting === 0 &&
  review.quality_rating === 0 &&
  review.yield_rating === 0 &&
  review.photos.length === 0

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

  return null
}

export const formatReviewPhotos = (review) => {
  const newReview = { ...review }
  newReview.photo_ids = review.photos.map((photo) => photo.id)
  delete newReview.photos
  return newReview
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

    <Slider
      name="review.fruiting"
      label="Fruiting Status"
      labels={['Unsure', 'Flowers', 'Unripe fruit', 'Ripe fruit']}
    />
    <Slider
      name="review.quality_rating"
      label="Quality"
      labels={['Unsure', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']}
    />
    <Slider
      name="review.yield_rating"
      label="Yield"
      labels={['Unsure', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']}
    />
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
      ...formatReviewPhotos(review),
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

  const { recaptcha, handlePresubmit } = useInvisibleRecaptcha(handleSubmit)

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
      {isLoggedIn && recaptcha}
    </FormikAllSteps>
  )
}
