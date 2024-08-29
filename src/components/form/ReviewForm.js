import { darken } from 'polished'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { FRUITING_OPTIONS, INITIAL_REVIEW_VALUES } from '../../constants/form'
import {
  deleteLocationReview,
  submitLocationReview,
} from '../../redux/locationSlice'
import { formToReview, validateReview } from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import { FormRatingWrapper } from '../auth/AuthWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import { ProgressButtons } from './FormikStepper'
import {
  DateInput,
  PhotoUploader,
  RatingInput,
  Select,
  Textarea,
} from './FormikWrappers'
import { FormWrapper } from './FormLayout'

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
          Leave a review
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
      label="Observed on"
      invalidWhenUntouched
    />

    <Select
      label="Fruiting status"
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
  <PhotoUploader name="review.photos" label="Upload images" />
)

const RatingLabeledRow = styled(LabeledRow)`
  > div > label {
    color: ${({ theme }) => theme.text};
    font-weight: normal;
  }
`

export const ReviewForm = ({
  initialValues = INITIAL_REVIEW_VALUES,
  editingId = null,
}) => {
  const { locationId } = useSelector((state) => state.location)
  const dispatch = useDispatch()
  const history = useAppHistory()

  const handleSubmit = (
    { 'g-recaptcha-response': recaptcha, review },
    { resetForm },
  ) => {
    const reviewValues = {
      ...formToReview(review),
      'g-recaptcha-response': recaptcha,
    }

    dispatch(
      submitLocationReview({ locationId, reviewValues, editingId }),
    ).then((action) => {
      if (action.payload) {
        resetForm()
        history.push(`/locations/${locationId}`)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    } else {
      dispatch(deleteLocationReview(editingId)).then(() => {
        history.push(`/locations/${locationId}`)
      })
    }
  }

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validate={({ review }) => validateReview(review)}
      renderButtons={(formikProps) => {
        const { isSubmitting, isValid, dirty } = formikProps
        return (
          <ProgressButtons>
            <div style={{ textAlign: editingId ? 'center' : 'left' }}>
              <Button
                disabled={isSubmitting || !isValid || !dirty}
                type="submit"
              >
                {isSubmitting ? 'Submitting' : 'Submit'}
              </Button>
              {editingId && (
                <DeleteButton type="button" onClick={handleDelete}>
                  Delete
                </DeleteButton>
              )}
            </div>
          </ProgressButtons>
        )
      }}
    >
      <ReviewStep standalone hasHeading={editingId == null} />
      <ReviewPhotoStep />
    </FormWrapper>
  )
}
