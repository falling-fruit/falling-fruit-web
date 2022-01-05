import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { useTypesById } from '../../redux/useTypesById'
import { addLocation } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import Button from '../ui/Button'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import { TypeName } from '../ui/TypeName'
import FormikAllSteps from './FormikAllSteps'
import { FormikStepper, ProgressButtons, Step } from './FormikStepper'
import { Select, Textarea } from './FormikWrappers'
import {
  formatReviewPhotos,
  INITIAL_REVIEW_VALUES,
  isEmptyReview,
  ReviewPhotoStep,
  ReviewStep,
  validateReview,
} from './ReviewForm'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

const PROPERTY_ACCESS_LABELS = [
  'Source is on my property',
  'I have permission from the owner to add the source',
  'Source is on public land',
  'Source is on private property but overhangs public land',
  'Source is on private property (ask before you pick)',
]

// TODO: move this to commmon utils constants
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

const PROPERTY_ACCESS_OPTIONS = labelsToOptions(PROPERTY_ACCESS_LABELS)

const MONTH_OPTIONS = labelsToOptions(MONTH_LABELS)

const INITIAL_VALUES = {
  types: [],
  description: '',
  ...INITIAL_REVIEW_VALUES,
}

const StyledLocationForm = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;

  @media ${({ theme }) => theme.device.mobile} {
    padding: 8px 27px 20px;
    margin-top: 87px;
  }
`

const InlineSelects = styled.div`
  display: flex;
  align-items: center;

  > span {
    // Text
    margin: 0 10px;
  }

  > div {
    // Select
    flex: 1;
  }
`

const LocationStep = ({ typeOptions }) => (
  <>
    <Select
      name="types"
      label="Types"
      options={typeOptions}
      isMulti
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      formatOptionLabel={(option) => <TypeName typeId={option.value} />}
      isVirtualized
      required
      // TODO: fix select searching
    />
    <Textarea
      name="description"
      label="Description"
      placeholder="Location details, access issues, plant health ..."
    />
    <Select
      name="access"
      label="Property Access"
      options={PROPERTY_ACCESS_OPTIONS}
      isSearchable={false}
      isClearable
    />
    <Label>
      Seasonality
      <Optional />
    </Label>
    <InlineSelects>
      <Select
        name="season_start"
        options={MONTH_OPTIONS}
        isSearchable={false}
        isClearable
      />
      <span>to</span>
      <Select
        name="season_end"
        options={MONTH_OPTIONS}
        isSearchable={false}
        isClearable
      />
    </InlineSelects>
  </>
)

const validateLocation = (values) => {
  const { review, types, season_start, season_end } = values

  const errors = {}

  if (types.length === 0) {
    errors.types = true
  }

  if (season_start?.value && season_end?.value) {
    if (season_end.value < season_start.value) {
      errors.season_end = true
    }
  } else if (season_start?.value) {
    errors.season_end = true
  } else if (season_end?.value) {
    errors.season_start = true
  }

  if (!isEmptyReview(review)) {
    Object.assign(errors, validateReview(review))
  }

  return errors
}

export const LocationForm = ({ desktop }) => {
  // TODO: create a "going back" util
  const history = useHistory()
  const { state } = useLocation()
  const { typesById } = useTypesById()

  const { lat, lng } = useSelector((state) => state.map.view.center)
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  // TODO: internationalize common name
  const typeOptions = useMemo(
    () =>
      typesById
        ? Object.values(typesById).map(
            ({ id, common_names, scientific_names }) => ({
              value: id,
              label: `${common_names.en[0]} [${scientific_names?.[0] ?? ''}]`,
            }),
          )
        : [],
    [typesById],
  )

  const steps = [
    <LocationStep key={1} typeOptions={typeOptions} />,
    <ReviewStep key={2} />,
    <ReviewPhotoStep key={3} />,
  ]

  const formikSteps = steps.map((step, index) => (
    <Step key={index} label={`Step ${index + 1}`}>
      {step}
    </Step>
  ))

  const handleSubmit = async ({
    'g-recaptcha-response': recaptcha,
    types,
    description,
    season_start,
    season_end,
    access,
    review,
  }) => {
    const locationValues = {
      'g-recaptcha-response': recaptcha,
      type_ids: types.map(({ value }) => value),
      description,
      season_start: season_start?.value,
      season_end: season_end?.value,
      access: access?.value,
      lat,
      lng,
      unverified: false,
    }

    if (!isEmptyReview(review)) {
      locationValues.review = formatReviewPhotos(review)
    }

    let response
    try {
      response = await addLocation(locationValues)
      toast.success('Location submitted successfully!')
    } catch {
      toast.error('Location submission failed.')
      console.error(response)
    }

    if (response && !response.error) {
      history.push(getPathWithMapState('/map'))
      // TODO: on form submission, reload map so that new location appears
    }
  }

  const { recaptcha, handlePresubmit } = useInvisibleRecaptcha(handleSubmit)

  const StepDisplay = desktop ? FormikAllSteps : FormikStepper

  return (
    <StyledLocationForm>
      <StepDisplay
        validateOnChange={false}
        validate={validateLocation}
        initialValues={INITIAL_VALUES}
        validateOnMount
        onSubmit={isLoggedIn ? handleSubmit : handlePresubmit}
        // For all steps only
        renderButtons={({ isSubmitting, isValid }) => (
          <ProgressButtons>
            <Button
              secondary
              type="button"
              onClick={() =>
                history.push(getPathWithMapState(state?.fromPage ?? '/map'))
              }
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting || !isValid} type="submit">
              {isSubmitting ? 'Submitting' : 'Submit'}
            </Button>
          </ProgressButtons>
        )}
      >
        {formikSteps}
        {isLoggedIn && recaptcha}
      </StepDisplay>
    </StyledLocationForm>
  )
}
