import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Route, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { saveLocationFormValues } from '../../redux/locationSlice'
import { saveReviewFormValues } from '../../redux/reviewSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import SettingsButton from '../desktop/SettingsButton'
import BackButton from '../ui/BackButton'
import TopBar from '../ui/TopBar'
import TopBarNav from '../ui/TopBarNav'
import { EditReviewForm } from './EditReview'
import { LocationForm } from './LocationForm'
import { ReviewForm } from './ReviewForm'

const StyledNavBack = styled.div`
  padding: 25px 15px 15px 10px;
  display: flex;
  justify-content: space-between;

  svg {
    height: 20px;
    margin-right: 5px;
  }
`

const Header = styled.h3`
  margin-left: 10px;
`

const MobileNav = ({ title, onBack }) => (
  <TopBar>
    <TopBarNav onBack={onBack} title={title} />
  </TopBar>
)

const DesktopNav = ({ title, onBack }) => {
  const { t } = useTranslation()
  return (
    <>
      <StyledNavBack>
        <BackButton onClick={onBack}>
          <ArrowBack />
          {t('layouts.back')}
        </BackButton>
      </StyledNavBack>
      <Header>{title}</Header>
    </>
  )
}

const DesktopButtonUnderForm = ({ formRef, saveFormValues }) => {
  const dispatch = useDispatch()
  const history = useAppHistory()

  const handleClick = () => {
    if (formRef.current) {
      dispatch(saveFormValues(formRef.current.values))
    }
    history.push('/settings')
  }

  return <SettingsButton onClick={handleClick} />
}

const EditLocation = ({ NavComponent, withSettingsButton }) => {
  const history = useAppHistory()
  const formRef = useRef()
  const { locationId } = useParams()
  const { t } = useTranslation()

  return (
    <>
      <NavComponent
        title={t('menu.edit_location')}
        onBack={(event) => {
          event.stopPropagation()
          history.push(`/locations/${locationId}`)
        }}
      />
      <LocationForm editingId={Number(location.id)} innerRef={formRef}/>
      {withSettingsButton && (
        <DesktopButtonUnderForm
          formRef={formRef}
          saveFormValues={saveLocationFormValues}
        />
      )}
    </>
  )
}

const AddLocation = ({ NavComponent, backUrl, withSettingsButton }) => {
  const history = useAppHistory()
  const formRef = useRef()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <>
      <NavComponent
        title={t('menu.add_new_location')}
        onBack={(event) => {
          event.stopPropagation()
          if (formRef.current) {
            dispatch(saveLocationFormValues(formRef.current.values))
          }
          history.push(backUrl)
        }}
      />
      <LocationForm innerRef={formRef} />
      {withSettingsButton && (
        <DesktopButtonUnderForm
          formRef={formRef}
          saveFormValues={saveLocationFormValues}
        />
      )}
    </>
  )
}

const AddReview = ({ NavComponent }) => {
  const history = useAppHistory()
  const { locationId } = useParams()
  const { t } = useTranslation()

  return (
    <>
      <NavComponent
        title={t('menu.add_review')}
        onBack={(event) => {
          event.stopPropagation()
          history.push(`/locations/${locationId}`)
        }}
      />
      <ReviewForm />
    </>
  )
}

const EditReview = ({ NavComponent, withSettingsButton }) => {
  const history = useAppHistory()
  const formRef = useRef()
  const { review } = useSelector((state) => state.review)
  const { t } = useTranslation()

  return (
    <>
      <NavComponent
        title={t('menu.edit_review')}
        onBack={(event) => {
          event.stopPropagation()
          history.push(`/locations/${review?.location_id}`)
        }}
      />
      <EditReviewForm innerRef={formRef} />
      {withSettingsButton && (
        <DesktopButtonUnderForm
          formRef={formRef}
          saveFormValues={saveReviewFormValues}
        />
      )}
    </>
  )
}

export const formRoutesMobile = [
  <Route key="edit-location" path="/locations/:locationId/edit">
    <EditLocation NavComponent={MobileNav} />
  </Route>,
  <Route key="add-location" path="/locations/new">
    <AddLocation NavComponent={MobileNav} backUrl="/locations/init" />
  </Route>,
  <Route key="add-review" path="/locations/:locationId/review">
    <AddReview NavComponent={MobileNav} />
  </Route>,
  <Route key="edit-review" path="/reviews/:reviewId/edit">
    <EditReview NavComponent={MobileNav} />
  </Route>,
]

export const formRoutesDesktop = [
  <Route key="edit-location" path="/locations/:locationId/edit">
    <EditLocation NavComponent={DesktopNav} withSettingsButton />
  </Route>,
  <Route key="add-location" path="/locations/new">
    <AddLocation NavComponent={DesktopNav} backUrl="/map" withSettingsButton />
  </Route>,
  <Route key="edit-review" path="/reviews/:reviewId/edit">
    <EditReview NavComponent={DesktopNav} withSettingsButton />
  </Route>,
]
