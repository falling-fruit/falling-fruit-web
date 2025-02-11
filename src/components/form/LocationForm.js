import { Map } from '@styled-icons/boxicons-solid'
import { Form, Formik, useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { INITIAL_LOCATION_VALUES } from '../../constants/form'
import {
  addNewLocation,
  editExistingLocation,
  saveFormValues,
} from '../../redux/locationSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import {
  formToLocation,
  formToReview,
  isEmptyReview,
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
        <PositionFieldReadOnly lat={lat} lng={lng} />
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
        isSearchable={false}
        toFormikValue={(x) => x?.value}
        fromFormikValue={(x) =>
          propertyAccessOptions.find((o) => o.value === x)
        }
        isClearable
      />
      <Label>{t('locations.form.season')}</Label>
      <InlineSelects>
        <Select
          name="season_start"
          options={monthOptions}
          isSearchable={false}
          toFormikValue={(x) => x?.value}
          fromFormikValue={(x) => monthOptions.find((o) => o.value === x)}
          isClearable
        />
        <span>to</span>
        <Select
          name="season_stop"
          options={monthOptions}
          isSearchable={false}
          toFormikValue={(x) => x?.value}
          fromFormikValue={(x) => monthOptions.find((o) => o.value === x)}
          isClearable
        />
      </InlineSelects>
      <CheckboxLabel>
        <Checkbox name="unverified" label={t('glossary.unverified')} />
        {t('glossary.unverified')}
      </CheckboxLabel>
    </>
  )
}

export const LocationForm = ({ editingId, initialValues, innerRef }) => {
  const reduxFormValues = useSelector((state) => state.location.form)
  const mergedInitialValues = {
    ...INITIAL_LOCATION_VALUES,
    ...initialValues,
    ...reduxFormValues,
  }
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { position, isLoading, location } = useSelector(
    (state) => state.location,
  )
  const positionDirty =
    !editingId ||
    (position &&
      location &&
      !(position.lat === location.lat && position.lng === location.lng))

  const handleSubmit = (
    { 'g-recaptcha-response': recaptcha, review, ...location },
    formikProps,
  ) => {
    const locationValues = {
      'g-recaptcha-response': recaptcha,
      lat: position?.lat || null,
      lng: position?.lng || null,
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
          history.push(`/locations/${action.payload.id}`)
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

  return (
    <StyledForm>
      <Formik
        validate={validateLocation}
        initialValues={mergedInitialValues}
        validateOnMount
        onSubmit={isLoggedIn ? handleSubmit : onPresubmit}
        innerRef={innerRef}
      >
        {(formikProps) => {
          const { isSubmitting, isValid, dirty } = formikProps
          const formDirty = dirty || positionDirty

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
                  disabled={isSubmitting || !isValid || !formDirty}
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
