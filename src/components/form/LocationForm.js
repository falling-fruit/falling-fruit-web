import { Map } from '@styled-icons/boxicons-solid'
import { useFormikContext } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { saveFormValues } from '../../redux/locationSlice'
import { fetchLocations } from '../../redux/viewChange'
import { addLocation, editLocation } from '../../utils/api'
import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Button from '../ui/Button'
import IconBesideText from '../ui/IconBesideText'
import Label from '../ui/Label'
import LoadingIndicator from '../ui/LoadingIndicator'
import FormikAllSteps from './FormikAllSteps'
import { FormikStepper, ProgressButtons, Step } from './FormikStepper'
import { Checkbox, Select, Textarea } from './FormikWrappers'
import {
  formToReview,
  INITIAL_REVIEW_VALUES,
  isEmptyReview,
  ReviewPhotoStep,
  ReviewStep,
  validateReview,
  validateReviewStep,
} from './ReviewForm'
import TypesSelect from './TypesSelect'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

const StyledPositionFieldLink = styled(Link)`
  color: ${({ theme }) => theme.orange};
  text-decoration: none;
`

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

const CheckboxLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.tertiaryText};
  margin-top: 15px;
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

const PositionFieldLink = ({ lat, lng, editingId }) => {
  const { values } = useFormikContext()
  const dispatch = useDispatch()
  return (
    <StyledPositionFieldLink
      onClick={() => {
        dispatch(saveFormValues(values))
      }}
      to={pathWithCurrentView(`/locations/${editingId}/edit/position`)}
    >
      <PositionFieldReadOnly lat={lat} lng={lng} />
    </StyledPositionFieldLink>
  )
}

const PositionFieldReadOnly = ({ lat, lng }) => (
  <IconBesideText tabIndex={0}>
    <Map size={20} />
    <p className="small">
      {lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : ''}
    </p>
  </IconBesideText>
)

const LocationStep = ({ lat, lng, isDesktop, editingId, isLoading }) => (
  <>
    <TypesSelect />
    <Label>Position</Label>
    {isLoading ? (
      <LoadingIndicator />
    ) : isDesktop || !editingId ? (
      <PositionFieldReadOnly lat={lat} lng={lng} />
    ) : (
      <PositionFieldLink lat={lat} lng={lng} editingId={editingId} />
    )}
    <Textarea
      name="description"
      label="Description"
      placeholder="Location details, access issues, plant health ..."
    />
    <Select
      name="access"
      label="Property access"
      options={PROPERTY_ACCESS_OPTIONS}
      isSearchable={false}
      isClearable
    />
    <Label>Seasonality</Label>
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
    <CheckboxLabel>
      <Checkbox name="unverified" label="Unverified" />
      Unverified
    </CheckboxLabel>
  </>
)

const validateLocationStep = ({ types }) => {
  const errors = {}
  if (types.length === 0) {
    errors.types = true
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
  unverified,
}) => ({
  type_ids: types.map(({ value }) => value),
  description,
  season_start: season_start?.value ?? null,
  season_stop: season_stop?.value ?? null,
  access: access?.value ?? null,
  unverified,
})

export const locationToForm = ({
  type_ids,
  description,
  season_start,
  season_stop,
  access,
  unverified,
}) => ({
  types: type_ids.map((id) => ({
    value: id,
  })),
  description,
  season_start: MONTH_OPTIONS[season_start],
  season_stop: MONTH_OPTIONS[season_stop],
  access: PROPERTY_ACCESS_OPTIONS[access],
  unverified,
})

export const LocationForm = ({
  editingId,
  onSubmit,
  initialValues,
  stepped,
}) => {
  const reduxFormValues = useSelector((state) => state.location.form)
  const mergedInitialValues = {
    ...INITIAL_LOCATION_VALUES,
    ...initialValues,
    ...reduxFormValues,
  }
  // TODO: create a "going back" util
  const history = useAppHistory()
  const { state } = useLocation()
  const isDesktop = useIsDesktop()

  const dispatch = useDispatch()

  const { position, isLoading } = useSelector((state) => state.location)
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const formikSteps = [
    <Step key={1} label="Step 1" validate={validateLocationStep}>
      <LocationStep
        key={1}
        lat={position?.lat}
        lng={position?.lng}
        isDesktop={isDesktop}
        editingId={editingId}
        isLoading={isLoading}
      />
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

  onSubmit =
    onSubmit ?? ((response) => history.push(`/locations/${response.id}`))
  const handleSubmit = async ({
    'g-recaptcha-response': recaptcha,
    review,
    ...location
  }) => {
    const locationValues = {
      'g-recaptcha-response': recaptcha,
      lat: position?.lat,
      lng: position?.lng,
      ...formToLocation(location),
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
      dispatch(fetchLocations())
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
        initialValues={mergedInitialValues}
        validateOnMount
        onSubmit={isLoggedIn ? handleSubmit : handlePresubmit}
        // For all steps only
        renderButtons={({ isSubmitting, isValid }) => (
          <ProgressButtons>
            <Button
              secondary
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (editingId) {
                  history.push(`/locations/${editingId}`)
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
