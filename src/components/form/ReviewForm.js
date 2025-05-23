import { Form, Formik } from 'formik'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { INITIAL_REVIEW_VALUES } from '../../constants/form'
import {
  addNewReview,
  deleteLocationReview,
  editExistingReview,
} from '../../redux/locationSlice'
import { formToReview, validateReview } from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { FormRatingWrapper } from '../auth/AuthWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { Optional } from '../ui/LabelTag'
import SectionHeading from '../ui/SectionHeading'
import {
  DateInput,
  PhotoUploader,
  RatingInput,
  Select,
  Textarea,
} from './FormikWrappers'
import { ProgressButtons, StyledForm } from './FormLayout'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

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

export const ReviewStep = ({ standalone, hasHeading = true }) => {
  const { t } = useTranslation()
  const fruitingOptions = [
    { label: t('locations.infowindow.fruiting.0'), value: 0 },
    { label: t('locations.infowindow.fruiting.1'), value: 1 },
    { label: t('locations.infowindow.fruiting.2'), value: 2 },
  ]

  return (
    <>
      {hasHeading && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a id="review" style={{ textDecoration: 'none' }}>
          <SectionHeading>
            {t('review.form.leave_a_review')}
            {!standalone && <Optional />}
          </SectionHeading>
        </a>
      )}

      <Textarea
        name="review.comment"
        placeholder={t('locations.form.comments_subtext')}
        label={t('locations.form.comments')}
      />

      <DateInput
        name="review.observed_on"
        label={t('review.form.observed_on')}
        invalidWhenUntouched
      />

      <Select
        label={t('locations.form.fruiting_status')}
        name="review.fruiting"
        options={fruitingOptions}
        isSearchable={false}
        toFormikValue={(x) => x?.value}
        fromFormikValue={(x) => fruitingOptions.find((o) => o.value === x)}
        isClearable
      />

      <FormRatingWrapper>
        <RatingLabeledRow
          label={
            <label htmlFor="review.quality_rating-group">
              {t('glossary.quality')}
            </label>
          }
          right={
            <RatingInput
              name="review.quality_rating"
              label={t('glossary.quality')}
              total={5}
            />
          }
        />
        <RatingLabeledRow
          label={
            <label htmlFor="review.yield_rating-group">
              {t('glossary.yield')}
            </label>
          }
          right={
            <RatingInput
              name="review.yield_rating"
              label={t('glossary.yield')}
              total={5}
            />
          }
        />
      </FormRatingWrapper>

      <PhotoUploader name="review.photos" label={t('review.form.photos')} />
    </>
  )
}

const RatingLabeledRow = styled(LabeledRow)`
  > div > label {
    color: ${({ theme }) => theme.text};
    font-weight: normal;
  }
`

export const ReviewForm = ({ initialValues, editingId = null, innerRef }) => {
  const { locationId } = useSelector((state) => state.location)
  const reduxFormValues = useSelector((state) => state.review.form)
  const mergedInitialValues = {
    ...INITIAL_REVIEW_VALUES,
    ...initialValues,
    ...reduxFormValues,
  }
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  const handleSubmit = (
    { 'g-recaptcha-response': recaptcha, review },
    formikProps,
  ) => {
    const reviewValues = {
      ...formToReview(review),
      'g-recaptcha-response': recaptcha,
    }

    if (editingId) {
      dispatch(editExistingReview({ reviewId: editingId, reviewValues })).then(
        (action) => {
          if (action.error) {
            formikProps.setSubmitting(false)
          } else {
            history.push(`/locations/${locationId}`)
          }
        },
      )
    } else {
      dispatch(addNewReview({ locationId, reviewValues })).then((action) => {
        if (action.error) {
          formikProps.setSubmitting(false)
        } else {
          if (isDesktop) {
            //form inline under location page
            formikProps.resetForm()
          } else {
            //form on its own page - go back to location page
            history.push(`/locations/${locationId}`)
          }
        }
      })
    }
  }

  const handleDelete = (formikProps) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    } else {
      dispatch(deleteLocationReview(editingId)).then((action) => {
        if (action.error) {
          formikProps.setSubmitting(false)
        } else {
          history.push(`/locations/${locationId}`)
        }
      })
    }
  }

  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const { Recaptcha, handlePresubmit: onPresubmit } =
    useInvisibleRecaptcha(handleSubmit)

  return (
    <StyledForm>
      <Formik
        validate={({ review }) => validateReview(review)}
        initialValues={mergedInitialValues}
        validateOnMount
        onSubmit={isLoggedIn ? handleSubmit : onPresubmit}
        innerRef={innerRef}
      >
        {(formikProps) => {
          const { isSubmitting, isValid, dirty } = formikProps

          return (
            <Form>
              <ReviewStep
                standalone
                hasHeading={isDesktop && editingId == null}
              />
              <ProgressButtons>
                <div style={{ textAlign: editingId ? 'center' : 'start' }}>
                  <Button
                    disabled={isSubmitting || !isValid || !dirty}
                    type="submit"
                  >
                    {isSubmitting
                      ? t('form.button.submitting')
                      : t('form.button.submit')}
                  </Button>
                  {editingId && (
                    <DeleteButton
                      type="button"
                      onClick={() => handleDelete(formikProps)}
                    >
                      {t('form.button.delete')}
                    </DeleteButton>
                  )}
                </div>
              </ProgressButtons>
              {!isLoggedIn && <Recaptcha />}
            </Form>
          )
        }}
      </Formik>
    </StyledForm>
  )
}
