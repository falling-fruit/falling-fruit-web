import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { INITIAL_REVIEW_VALUES } from '../../constants/form'
import { addNewReview, editExistingReview } from '../../redux/locationSlice'
import { formToReview, validateReview } from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
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
import NotSignedInClickthrough from './NotSignedInClickthrough'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

export const ReviewStep = ({ standalone }) => {
  const { t } = useTranslation()
  const fruitingOptions = [
    { label: t('locations.infowindow.fruiting.0'), value: 0 },
    { label: t('locations.infowindow.fruiting.1'), value: 1 },
    { label: t('locations.infowindow.fruiting.2'), value: 2 },
  ]

  return (
    <>
      {!standalone && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a id="review" style={{ textDecoration: 'none' }}>
          <SectionHeading>
            {t('review.form.leave_a_review')}
            {<Optional />}
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
          history.push(`/locations/${locationId}`)
        }
      })
    }
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    history.push(`/locations/${locationId}`)
  }

  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const { Recaptcha, handlePresubmit: onPresubmit } =
    useInvisibleRecaptcha(handleSubmit)

  return (
    <StyledForm>
      {!isLoggedIn && <NotSignedInClickthrough flavour="review" />}
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
              <ReviewStep standalone />
              <ProgressButtons>
                <Button secondary type="button" onClick={handleCancel}>
                  {t('form.button.cancel')}
                </Button>
                <Button
                  disabled={isSubmitting || !isValid || !dirty}
                  type="submit"
                >
                  {isSubmitting
                    ? t('form.button.submitting')
                    : t('form.button.submit')}
                </Button>
              </ProgressButtons>
              {!isLoggedIn && <Recaptcha />}
            </Form>
          )
        }}
      </Formik>
    </StyledForm>
  )
}
