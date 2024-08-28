import { Map } from '@styled-icons/boxicons-solid'
import { useFormikContext } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  INITIAL_LOCATION_VALUES,
  MONTH_OPTIONS,
  PROPERTY_ACCESS_OPTIONS,
} from '../../constants/form'
import { saveFormValues, submitLocation } from '../../redux/locationSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import {
  formToLocation,
  formToReview,
  isEmptyReview,
  validateLocation,
  validateLocationStep,
  validateReviewStep,
} from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Button from '../ui/Button'
import IconBesideText from '../ui/IconBesideText'
import Label from '../ui/Label'
import LoadingIndicator from '../ui/LoadingIndicator'
import { ProgressButtons, Step } from './FormikStepper'
import { Checkbox, Select, Textarea } from './FormikWrappers'
import { FormWrapper } from './FormLayout'
import { ReviewPhotoStep, ReviewStep } from './ReviewForm'
import TypesSelect from './TypesSelect'

const StyledPositionFieldLink = styled(Link)`
  color: ${({ theme }) => theme.orange};
  text-decoration: none;
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

export const LocationForm = ({ editingId, initialValues, stepped }) => {
  const reduxFormValues = useSelector((state) => state.location.form)
  const mergedInitialValues = {
    ...INITIAL_LOCATION_VALUES,
    ...initialValues,
    ...reduxFormValues,
  }
  const history = useAppHistory()
  const { state } = useLocation()
  const isDesktop = useIsDesktop()

  const dispatch = useDispatch()

  const { position, isLoading } = useSelector((state) => state.location)

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

  const handleSubmit = ({
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

    dispatch(submitLocation({ editingId, locationValues })).then((action) => {
      if (action.payload) {
        history.push(`/locations/${action.payload.id}`)
      }
    })
  }
  const handleCancel = (e) => {
    e.stopPropagation()
    if (editingId) {
      history.push(`/locations/${editingId}`)
    } else {
      history.push(state?.fromPage ?? '/map')
    }
  }

  return (
    <FormWrapper
      validate={validateLocation}
      initialValues={mergedInitialValues}
      onSubmit={handleSubmit}
      stepped={stepped}
      renderButtons={({ isSubmitting, isValid }) => (
        <ProgressButtons>
          <Button secondary type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isSubmitting || !isValid} type="submit">
            {isSubmitting ? 'Submitting' : 'Submit'}
          </Button>
        </ProgressButtons>
      )}
    >
      {formikSteps}
    </FormWrapper>
  )
}
