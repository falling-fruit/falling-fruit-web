import { Map } from '@styled-icons/boxicons-solid'
import { ErrorMessage, Form, Formik, useFormikContext } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { INITIAL_LOCATION_VALUES } from '../../constants/form'
import {
  addNewLocation,
  editExistingLocation,
  saveLocationFormValues,
} from '../../redux/locationSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import {
  formToLocation,
  formToReview,
  isEmptyReview,
  isTooClose,
  locationToForm,
  validateLocation,
} from '../../utils/form'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { formatMonth } from '../entry/textFormatters'
import Button from '../ui/Button'
import IconBesideText from '../ui/IconBesideText'
import Label from '../ui/Label'
import LoadingIndicator from '../ui/LoadingIndicator'
import { Checkbox, Select, Textarea } from './FormikWrappers'
import { ProgressButtons, StyledForm } from './FormLayout'
import NotSignedInClickthrough from './NotSignedInClickthrough'
import { ReviewStep } from './ReviewForm'
import TypesSelect from './TypesSelect'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

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
  margin-block-start: 15px;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.red};
  font-size: 0.85rem;
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
        dispatch(saveLocationFormValues(values))
      }}
      to={pathWithCurrentView(`/locations/${editingId}/edit/position`)}
    >
      <PositionFieldReadOnly lat={lat} lng={lng} editingId={editingId} />
    </StyledPositionFieldLink>
  )
}

const PositionFieldReadOnly = ({ lat, lng, editingId }) => {
  const { locations } = useSelector((state) => state.map)
  const { position } = useSelector((state) => state.location)
  const { t } = useTranslation()
  const tooClose = lat && lng && isTooClose({ lat, lng }, locations, editingId)
  const { setFieldError, setTouched, setFieldValue, errors, touched } =
    useFormikContext()
  const positionTouched = !!touched.position

  // Set position as touched on mount
  useEffect(() => {
    setTouched({ position: true })
  }, [setTouched])

  // Update formik value when position changes in Redux
  useEffect(() => {
    if (position?.lat && position?.lng) {
      setFieldValue('position', { lat: position.lat, lng: position.lng })
    }
  }, [position, setFieldValue])

  // Handle validation for position
  useEffect(() => {
    if (tooClose) {
      setFieldError('position', t('locations.init.position_too_close'))
    } else {
      setFieldError('position', undefined)
    }
  }, [
    positionTouched,
    tooClose,
    lat,
    lng,
    errors.position,
    touched.position,
    setFieldError,
    t,
  ])

  return (
    <>
      <IconBesideText tabIndex={0}>
        <Map size={20} />
        <p className="small" dir="ltr">
          {lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : ''}
        </p>
      </IconBesideText>

      <ErrorMessage name="position" component={ErrorText} />
    </>
  )
}

const LocationStep = ({ lat, lng, isDesktop, editingId, isLoading }) => {
  const { i18n, t } = useTranslation()
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: formatMonth(i, i18n.language),
    value: i,
  }))
  const propertyAccessOptions = [
    {
      label: t('locations.infowindow.access_mode.0'),
      value: 0,
    },
    {
      label: t('locations.infowindow.access_mode.1'),
      value: 1,
    },
    {
      label: t('locations.infowindow.access_mode.2'),
      value: 2,
    },
    {
      label: t('locations.infowindow.access_mode.3'),
      value: 3,
    },
    {
      label: t('locations.infowindow.access_mode.4'),
      value: 4,
    },
  ]
  return (
    <>
      <TypesSelect />
      <Label>{t('locations.form.position')}</Label>
      {isLoading ? (
        <LoadingIndicator />
      ) : isDesktop || !editingId ? (
        <PositionFieldReadOnly lat={lat} lng={lng} editingId={editingId} />
      ) : (
        <PositionFieldLink lat={lat} lng={lng} editingId={editingId} />
      )}
      <Textarea
        name="description"
        label={t('glossary.description')}
        placeholder={t('locations.form.description_subtext')}
      />
      <Select
        name="access"
        label={t('locations.form.access')}
        options={propertyAccessOptions}
        toFormikValue={(x) => x?.value}
        fromFormikValue={(x) =>
          propertyAccessOptions.find((o) => o.value === x)
        }
        clearable
      />
      <Label>{t('locations.form.season')}</Label>
      <InlineSelects>
        <Select
          name="season_start"
          options={monthOptions}
          toFormikValue={(x) => x?.value}
          fromFormikValue={(x) => monthOptions.find((o) => o.value === x)}
          clearable
        />
        <span>{t('locations.form.season_start_to_stop_short')}</span>
        <Select
          name="season_stop"
          options={monthOptions}
          toFormikValue={(x) => x?.value}
          fromFormikValue={(x) => monthOptions.find((o) => o.value === x)}
          clearable
        />
      </InlineSelects>
      <CheckboxLabel>
        <Checkbox id="unverified" label={t('glossary.unverified')} />
        {t('glossary.unverified')}
      </CheckboxLabel>
    </>
  )
}

export const LocationForm = ({ editingId, innerRef }) => {
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    position,
    isLoading,
    location,
    form: reduxFormValues,
  } = useSelector((state) => state.location)

  const { typesAccess } = useSelector((state) => state.type)

  const initialValues =
    !location || typesAccess.isEmpty
      ? {}
      : locationToForm(location, typesAccess)

  const mergedInitialValues = {
    ...INITIAL_LOCATION_VALUES,
    ...initialValues,
    ...reduxFormValues,
    position,
  }

  const handleSubmit = (
    { 'g-recaptcha-response': recaptcha, review, ...location },
    formikProps,
  ) => {
    const locationValues = {
      'g-recaptcha-response': recaptcha,
      ...formToLocation(location),
    }

    if (!isEmptyReview(review)) {
      locationValues.review = formToReview(review)
    }

    if (editingId) {
      dispatch(
        editExistingLocation({ locationId: editingId, locationValues }),
      ).then((action) => {
        if (action.error) {
          formikProps.setSubmitting(false)
        } else {
          history.push(`/locations/${action.payload.id}`)
        }
      })
    } else {
      dispatch(addNewLocation(locationValues)).then((action) => {
        if (action.error) {
          formikProps.setSubmitting(false)
        } else {
          history.push(`/locations/${action.payload.id}/success`)
        }
      })
    }
  }
  const handleCancel = (e) => {
    e.stopPropagation()
    if (editingId) {
      history.push(`/locations/${editingId}`)
    } else {
      history.push('/map')
    }
  }

  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const { Recaptcha, handlePresubmit: onPresubmit } =
    useInvisibleRecaptcha(handleSubmit)

  return isLoading || typesAccess.isEmpty ? (
    <div>{t('layouts.loading')}</div>
  ) : (
    <StyledForm>
      <NotSignedInClickthrough
        formType={editingId ? 'edit_location' : 'add_location'}
      />
      <Formik
        validate={validateLocation}
        initialValues={mergedInitialValues}
        onSubmit={isLoggedIn ? handleSubmit : onPresubmit}
        innerRef={innerRef}
      >
        {(formikProps) => {
          const { isSubmitting, isValid, dirty } = formikProps

          return (
            <Form>
              <LocationStep
                lat={position?.lat}
                lng={position?.lng}
                isDesktop={isDesktop}
                editingId={editingId}
                isLoading={isLoading}
              />
              {!editingId && (
                <>
                  <ReviewStep />
                </>
              )}
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
