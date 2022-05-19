import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { useTypesById } from '../../redux/useTypesById'
import { fetchLocations } from '../../redux/viewChange'
import { addLocation, editLocation } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import Button from '../ui/Button'
import Label from '../ui/Label'
import { Optional } from '../ui/LabelTag'
import { TypeName } from '../ui/TypeName'
import FormikAllSteps from './FormikAllSteps'
import { FormikStepper, ProgressButtons, Step } from './FormikStepper'
import { Select, Textarea } from './FormikWrappers'
import {
  formToReview,
  INITIAL_REVIEW_VALUES,
  isEmptyReview,
  ReviewPhotoStep,
  ReviewStep,
  validateReview,
  validateReviewStep,
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

const INITIAL_LOCATION_VALUES = {
  types: [],
  description: '',
  access: null,
  season_start: null,
  season_stop: null,
  ...INITIAL_REVIEW_VALUES,
}

const StyledLocationForm = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  overflow: auto;

  @media ${({ theme }) => theme.device.desktop} {
    height: 100%;
  }

  @media ${({ theme }) => theme.device.mobile} {
    padding: 8px 27px 20px;
    margin-top: 80px;

    textarea {
      height: 100px;

      @media (max-device-height: 600px) {
        height: 50px;
      }
    }
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
      invalidWhenUntouched
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
        invalidWhenUntouched
      />
      <span>to</span>
      <Select
        name="season_stop"
        options={MONTH_OPTIONS}
        isSearchable={false}
        isClearable
        invalidWhenUntouched
      />
    </InlineSelects>
  </>
)

const validateLocationStep = ({ types, season_start, season_stop }) => {
  const errors = {}

  if (types.length === 0) {
    errors.types = true
  }

  if ((season_start?.value != null) !== (season_stop?.value != null)) {
    if (season_start?.value != null) {
      errors.season_stop = true
    }
    if (season_stop?.value != null) {
      errors.season_start = true
    }
  }

  return errors
}

const validateLocation = ({ review, ...location }) => {
  const errors = validateLocationStep(location)

  if (!isEmptyReview(review)) {
    Object.assign(errors, validateReview(review))
  }

  return errors
}

const formToLocation = ({
  types,
  description,
  season_start,
  season_stop,
  access,
}) => ({
  type_ids: types.map(({ value }) => value),
  description,
  season_start: season_start?.value ?? null,
  season_stop: season_stop?.value ?? null,
  access: access?.value ?? null,
  unverified: false,
})

export const locationToForm = ({
  type_ids,
  description,
  season_start,
  season_stop,
  access,
}) => ({
  types: type_ids.map((id) => ({
    value: id,
  })),
  description,
  season_start: MONTH_OPTIONS[season_start],
  season_stop: MONTH_OPTIONS[season_stop],
  access: PROPERTY_ACCESS_OPTIONS[access],
})

export const LocationForm = ({
  editingId,
  onSubmit,
  initialValues = INITIAL_LOCATION_VALUES,
  stepped,
}) => {
  // TODO: create a "going back" util
  const history = useAppHistory()
  const { state } = useLocation()
  const { typesById } = useTypesById()

  const dispatch = useDispatch()

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

  const formikSteps = [
    <Step key={1} label="Step 1" validate={validateLocationStep}>
      <LocationStep key={1} typeOptions={typeOptions} />
    </Step>,
    ...(editingId
      ? []
      : [
          <Step
            key={2}
            label="Step 2"
            validate={({ review }) => validateReviewStep(review)}
          >
            <ReviewStep />
          </Step>,
          <Step key={3} label="Step 3" validate={validateLocation}>
            <ReviewPhotoStep />
          </Step>,
        ]),
  ]

  onSubmit = onSubmit ?? ((response) => history.push(`/entry/${response.id}`))
  const handleSubmit = async ({
    'g-recaptcha-response': recaptcha,
    review,
    ...location
  }) => {
    const locationValues = {
      'g-recaptcha-response': recaptcha,
      ...formToLocation(location),
      lat,
      lng,
    }

    if (!isEmptyReview(review)) {
      locationValues.review = formToReview(review)
    }

    let response
    try {
      if (editingId) {
        response = await editLocation(editingId, locationValues)
        toast.success('Location edited successfully!')
      } else {
        response = await addLocation(locationValues)
        toast.success('Location submitted successfully!')
      }
    } catch (e) {
      if (editingId) {
        toast.error('Location editing failed.')
      } else {
        toast.error('Location submission failed.')
      }
      console.error(e.response)
    }

    if (response && !response.error) {
      dispatch(fetchLocations)
      onSubmit(response)
    }
  }

  const { Recaptcha, handlePresubmit } = useInvisibleRecaptcha(handleSubmit)

  const StepDisplay = stepped ? FormikStepper : FormikAllSteps

  return (
    <StyledLocationForm>
      <StepDisplay
        validateOnChange={false}
        validate={validateLocation}
        initialValues={initialValues}
        validateOnMount
        onSubmit={isLoggedIn ? handleSubmit : handlePresubmit}
        // For all steps only
        renderButtons={({ isSubmitting, isValid }) => (
          <ProgressButtons>
            <Button
              secondary
              type="button"
              onClick={() => {
                if (editingId) {
                  history.push(`/entry/${editingId}`)
                } else {
                  history.push(state?.fromPage ?? '/map')
                }
              }}
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
        {!isLoggedIn && <Recaptcha />}
      </StepDisplay>
    </StyledLocationForm>
  )
}
