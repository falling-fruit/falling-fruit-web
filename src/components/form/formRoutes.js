import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Route, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { saveFormValues } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import BackButton from '../ui/BackButton'
import TopBar from '../ui/TopBar'
import TopBarNav from '../ui/TopBarNav'
import { EditLocationForm } from './EditLocation'
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
          {t('back')}
        </BackButton>
      </StyledNavBack>
      <Header>{title}</Header>
    </>
  )
}

const EditLocation = ({ NavComponent }) => {
  const history = useAppHistory()
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
      <EditLocationForm />
    </>
  )
}

const AddLocation = ({ NavComponent, backUrl }) => {
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
            dispatch(saveFormValues(formRef.current.values))
          }
          history.push(backUrl)
        }}
      />
      <LocationForm innerRef={formRef} />
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

const EditReview = ({ NavComponent }) => {
  const history = useAppHistory()
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
      <EditReviewForm />
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
    <EditLocation NavComponent={DesktopNav} />
  </Route>,
  <Route key="add-location" path="/locations/new">
    <AddLocation NavComponent={DesktopNav} backUrl="/map" />
  </Route>,
  <Route key="edit-review" path="/reviews/:reviewId/edit">
    <EditReview NavComponent={DesktopNav} />
  </Route>,
]
