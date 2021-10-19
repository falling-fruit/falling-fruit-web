import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useTypesById } from '../../redux/useTypesById'
import Button from '../ui/Button'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import { TypeName } from '../ui/TypeName'
import FormikAllSteps from './FormikAllSteps'
import { FormikStepper, ProgressButtons, Step } from './FormikStepper'
import { Select, Textarea } from './FormikWrappers'
import {
  INITIAL_REVIEW_VALUES,
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
  access: null,
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

    const errors = {
      types: types.length === 0,
      season_start: season_end?.value && !season_start?.value,
      season_end:
        (season_start?.value && !season_end?.value) ||
        season_end?.value < season_start?.value,
    }

    return errors
  }

  const handleSubmit = (values) => {
    console.log('submitted location form', values)
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
        renderButtons={(isSubmitting) => (
          <ProgressButtons>
            <Button
              secondary
              type="button"
              onClick={() => history.push(state?.fromPage ?? '/map')}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
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
