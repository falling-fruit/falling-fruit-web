import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { addReview } from '../../utils/api'
import Button from '../ui/Button'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import FormikAllSteps from './FormikAllSteps'
import { PhotoUploader, Slider, Textarea } from './FormikWrappers'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

export const INITIAL_REVIEW_VALUES = {
  photos: [],
  review: {
    comment: '',
    fruiting: 0,
    quality_rating: 0,
    yield_rating: 0,
  },
}

export const isValidReview = (review) =>
  review.comment ||
  review.fruiting !== 0 ||
  review.quality_rating !== 0 ||
  review.yield_rating !== 0

export const ReviewStep = ({ standalone }) => (
  <>
    <SectionHeading>
      Leave a Review
      {!standalone && <Optional />}
    </SectionHeading>
    <Textarea name="review.comment" placeholder="Lorem ipsum..." />

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
  <PhotoUploader name="photos" label="Upload Images" optional />
)

export const ReviewForm = ({ onSubmit }) => {
  const { id: locationId } = useParams()
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const handleSubmit = async (
    { 'g-recaptcha-response': recaptcha, review, photos },
    { resetForm },
  ) => {
    const reviewValues = {
      ...review,
      photo_ids: photos.map((photo) => photo.id),
      'g-recaptcha-response': recaptcha,
    }

    console.log('reviewValues', reviewValues)
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
      validate={({ review }) => {
        if (!isValidReview(review)) {
          return { review: { comment: true } }
        }
        return null
      }}
      renderButtons={({ isSubmitting }) => (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Publishing' : 'Publish Review'}
        </Button>
      )}
    >
      <ReviewStep standalone />
      <ReviewPhotoStep />
      {recaptcha}
    </FormikAllSteps>
  )
}
