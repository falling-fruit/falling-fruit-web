import { darken } from 'polished'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { addReview, deleteReview, editReview } from '../../utils/api'
import { FormRatingWrapper } from '../auth/AuthWrappers'
import { isEveryPhotoUploaded } from '../photo/PhotoUploader'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import FormikAllSteps from './FormikAllSteps'
import { FormikStepper, ProgressButtons, Step } from './FormikStepper'
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

/* TODO: Create a generic utility to build form options */
export const FRUITING_OPTIONS = ['Flowers', 'Unripe fruit', 'Ripe fruit'].map(
  (name, idx) => ({
    label: name,
    value: idx + 1,
  }),
)

export const isEmptyReview = (review) => {
  if (!review) {
    return true
  }

  const r = formToReview(review)
  return (
    !r.comment &&
    r.quality_rating === 0 &&
    r.fruiting === 0 &&
    r.yield_rating === 0 &&
    r.photo_ids.length === 0
  )
}

export const validateReviewStep = (review) => {
  const r = formToReview(review)
  if (r.fruiting !== 0 && !r.observed_on) {
    return {
      review: { observed_on: true },
    }
  }

  return null
}

export const validatePhotoStep = (review) => {
  if (isEmptyReview(review)) {
    return {
      review: { comment: true },
    }
  }

  if (!isEveryPhotoUploaded(review.photos)) {
    return {
      review: { photos: true },
    }
  }

  return null
}

export const validateReview = (review) => ({
  ...validatePhotoStep(review),
  ...validateReviewStep(review),
})

export const formToReview = (review) => {
  const formattedReview = {
    ...review,
    observed_on: review.observed_on || null,
    fruiting: review.fruiting?.value ?? 0,
    quality_rating: Number(review.quality_rating),
    yield_rating: Number(review.yield_rating),
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
  comment,
  photos: photos.map((photo) => ({
    id: photo.id,
    name: `My Photo ${photo.created_at.split('T')[0]}`,
    image: photo.thumb,
    isNew: false,
  })),
  observed_on: observed_on ?? '',
  fruiting: fruiting === 0 ? null : FRUITING_OPTIONS[fruiting - 1],
  yield_rating,
  quality_rating,
})

const DeleteButton = styled(Button)`
  background-color: ${({ theme }) => theme.invalid};
  border-color: ${({ theme }) => theme.invalid};

  @media ${({ theme }) => theme.device.desktop} {
    :hover:enabled {
      background: ${({ theme }) => darken(0.1, theme.invalid)};
      border-color: ${({ theme }) => darken(0.1, theme.invalid)};
    }
  }
`

export const ReviewStep = ({ standalone, hasHeading = true }) => (
  <>
    {hasHeading && (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a id="review" style={{ textDecoration: 'none' }}>
        <SectionHeading>
          Leave a Review
          {!standalone && <Optional />}
        </SectionHeading>
      </a>
    )}

    <Textarea
      name="review.comment"
      placeholder="Updates, access issues, plant health..."
      label="Comments"
    />

    <DateInput
      name="review.observed_on"
      label="Observed On"
      invalidWhenUntouched
    />

    <Select
      label="Fruiting Status"
      name="review.fruiting"
      options={FRUITING_OPTIONS}
      isClearable
    />

    <FormRatingWrapper>
      <RatingLabeledRow
        label={<label htmlFor="review.quality_rating-group">Quality</label>}
        right={
          <RatingInput name="review.quality_rating" label="Quality" total={5} />
        }
      />
      <RatingLabeledRow
        label={<label htmlFor="review.yield_rating-group">Yield</label>}
        right={
          <RatingInput name="review.yield_rating" label="Yield" total={5} />
        }
      />
    </FormRatingWrapper>
  </>
)

export const ReviewPhotoStep = () => (
  <PhotoUploader name="review.photos" label="Upload Images" />
)

const StyledReviewForm = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 27px 20px;
    margin-top: 80px;

    textarea {
      height: 90px;
    }
  }
`

const RatingLabeledRow = styled(LabeledRow)`
  > div > label {
    color: ${({ theme }) => theme.text};
    font-weight: normal;
  }
`

export const ReviewForm = ({
  stepped,
  onSubmit,
  initialValues = INITIAL_REVIEW_VALUES,
  editingId = null,
}) => {
  const { id: locationId } = useParams()
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const handleSubmit = async (
    { 'g-recaptcha-response': recaptcha, review },
    { resetForm },
  ) => {
    const reviewValues = {
      ...formToReview(review),
      'g-recaptcha-response': recaptcha,
    }

    let response
    try {
      if (editingId) {
        response = await editReview(editingId, reviewValues)
        toast.success('Review edited successfully!')
      } else {
        response = await addReview(locationId, reviewValues)
        toast.success('Review submitted successfully!')
      }
    } catch (e) {
      if (editingId) {
        toast.error('Review editing failed.')
      } else {
        toast.error('Review submission failed.')
      }
      console.error(e.response)
    }

    if (response && !response.error) {
      onSubmit(response)
      resetForm()
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await deleteReview(editingId)
      toast.success('Review deleted successfully!')
      onSubmit()
    } catch (e) {
      toast.error('Review deletion failed.')
      console.error(e)
    }
  }

  const { Recaptcha, handlePresubmit } = useInvisibleRecaptcha(handleSubmit)

  const StepDisplay = stepped ? FormikStepper : FormikAllSteps

  return (
    <StyledReviewForm>
      <StepDisplay
        onSubmit={isLoggedIn ? handleSubmit : handlePresubmit}
        initialValues={initialValues}
        validate={({ review }) => validateReview(review)}
        renderButtons={({ isSubmitting, isValid }) => (
          <ProgressButtons style={{ textAlign: editingId ? 'center' : 'left' }}>
            <Button disabled={isSubmitting || !isValid} type="submit">
              {isSubmitting ? 'Submitting' : 'Submit'}
            </Button>
            {editingId && (
              <DeleteButton type="button" onClick={handleDelete}>
                Delete
              </DeleteButton>
            )}
          </ProgressButtons>
        )}
      >
        <Step
          label="Step 1"
          validate={({ review }) => validateReviewStep(review)}
        >
          <ReviewStep standalone hasHeading={editingId == null && !stepped} />
        </Step>
        <Step label="Step 2" validate={({ review }) => validateReview(review)}>
          <ReviewPhotoStep />
        </Step>
        {!isLoggedIn && <Recaptcha />}
      </StepDisplay>
    </StyledReviewForm>
  )
}
