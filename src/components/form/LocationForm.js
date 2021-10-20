import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useTypesById } from '../../redux/useTypesById'
import { addLocation, addReview } from '../../utils/api'
import Button from '../ui/Button'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import { TypeName } from '../ui/TypeName'
import FormikAllSteps from './FormikAllSteps'
import { FormikStepper, ProgressButtons, Step } from './FormikStepper'
import { Select, Textarea } from './FormikWrappers'
import {
  INITIAL_REVIEW_VALUES,
  isValidReview,
  ReviewPhotoStep,
  ReviewStep,
} from './ReviewForm'

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
    <Textarea name="description" label="Description" />
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

export const LocationForm = ({ desktop }) => {
  // TODO: create a "going back" util
  const history = useHistory()
  const { state } = useLocation()
  const { typesById } = useTypesById()

  const { lat, lng } = useSelector((state) => state.map.view.center)

  const typeOptions = useMemo(
    () =>
      typesById
        ? Object.values(typesById).map(({ id, name, scientific_name }) => ({
            value: id,
            label: `${name} [${scientific_name}]`,
          }))
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

  const validate = (values) => {
    const { types, season_start, season_end } = values

    const errors = {}

    if (types && types.length === 0) {
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

    return errors
  }

  const handleSubmit = async (values) => {
    const {
      types,
      description,
      season_start,
      season_end,
      access,
      review,
    } = values

    const locationValues = {
      type_ids: types.map(({ value }) => value),
      description,
      season_start: season_start?.value,
      season_end: season_end?.value,
      access: access?.value,
      lat,
      lng,
      author: null,
      unverified: false,
    }

    console.log('locationValues', locationValues)
    const locationResp = await addLocation(locationValues)
    console.log('locationResp', locationResp)

    if (isValidReview(review)) {
      const reviewValues = {
        ...review,
        author: null,
      }

      console.log('reviewValues', reviewValues)
      const reviewResp = await addReview(locationResp.id, reviewValues)
      console.log('reviewResp', reviewResp)
    }

    history.push('/map')
  }

  const StepDisplay = desktop ? FormikAllSteps : FormikStepper

  return (
    <StyledLocationForm>
      <StepDisplay
        validateOnChange={false}
        validate={validate}
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        // For all steps only
        renderButtons={({ isValid, isSubmitting }) => (
          <ProgressButtons>
            <Button
              secondary
              type="button"
              onClick={() => history.push(state?.fromPage ?? '/map')}
            >
              Cancel
            </Button>
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? 'Submitting' : 'Submit'}
            </Button>
          </ProgressButtons>
        )}
      >
        {formikSteps}
      </StepDisplay>
    </StyledLocationForm>
  )
}
