import { Loader, Plus } from '@styled-icons/boxicons-regular'
import { MapAlt } from '@styled-icons/boxicons-solid'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { DEFAULT_GEOLOCATION_ZOOM } from '../../constants/map'
import {
  GeolocationState,
  requestGeolocation,
} from '../../redux/geolocationSlice'
import { viewToString } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import ActivityGlobe from '../activity/ActivityGlobe'
import AboutSection from '../mobile/AboutSection'
import MobileAppLinks from '../mobile/MobileAppLinks'
import MobileSocialLinks from '../mobile/MobileSocialLinks'
import Button from '../ui/Button'
import { NavHeader, PageHeader } from '../ui/Headers'
import { LandingPage } from '../ui/PageTemplate'
import { withAuthRedirect } from './withAuthRedirect'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
  margin: 1em 0;
`
const LargeButton = styled(Button)`
  min-height: 2em;
  font-size: 1em;
`

const Headline = styled(PageHeader)`
  margin-block-end: 0.25em;
`

const Description = styled.div`
  color: ${({ theme }) => theme.secondaryText};

const SpinnerIcon = styled(Loader)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const HomePage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useAppHistory()
  const location = useLocation()
  const bottomRef = useRef(null)
  const destinationRef = useRef('/map')
  const [pendingDestination, setPendingDestination] = useState(null)
  const { lastMapView } = useSelector((state) => state.viewport)
  const { geolocation, geolocationState } = useSelector(
    (state) => state.geolocation,
  )

  const goToDestination = (view) => {
    const destination = destinationRef.current
    const viewString =
      view ||
      (lastMapView?.center
        ? viewToString(
            lastMapView.center.lat,
            lastMapView.center.lng,
            lastMapView.zoom,
          )
        : null)
    history.push(viewString ? `${destination}/${viewString}` : destination)
  }

  const requestLocationThen = (destination) => {
    destinationRef.current = destination
    setPendingDestination(destination)
    if (
      lastMapView ||
      geolocationState === GeolocationState.DENIED ||
      geolocationState === GeolocationState.FAILED
    ) {
      goToDestination()
    } else {
      dispatch(requestGeolocation())
    }
  }

  const handleExploreMap = () => requestLocationThen('/map')

  const handleAddLocation = () => requestLocationThen('/locations/init')

  useEffect(() => {
    if (lastMapView) {
      return
    }
    if (
      geolocationState === GeolocationState.DENIED ||
      geolocationState === GeolocationState.FAILED
    ) {
      goToDestination()
    } else if (geolocation?.latitude && geolocation?.longitude) {
      goToDestination(
        viewToString(
          geolocation.latitude,
          geolocation.longitude,
          DEFAULT_GEOLOCATION_ZOOM,
        ),
      )
    }
  }, [lastMapView, geolocation, geolocationState, history]) //eslint-disable-line

  useEffect(() => {
    if (location.state?.scrollToBottom) {
      bottomRef.current?.scrollIntoView()
    }
  }, [location.state])

  const isLocating = geolocationState === GeolocationState.LOADING
  const isAddLocationSpinning =
    isLocating && pendingDestination === '/locations/init'
  const isExploreMapSpinning = isLocating && pendingDestination === '/map'

  return (
    <LandingPage>
      <Headline>{t('pages.welcome.headline')}</Headline>
      <Description>
        <p>{t('pages.welcome.intro_community')}</p>
        <p>{t('pages.welcome.intro_contribute')}</p>
      </Description>
      <ButtonWrapper>
        <LargeButton
          type="button"
          secondary
          leftIcon={
            isAddLocationSpinning ? (
              <SpinnerIcon height={30} />
            ) : (
              <Plus height={30} />
            )
          }
          onClick={handleAddLocation}
          disabled={isLocating}
        >
          {t('menu.add_new_location')}
        </LargeButton>
        <LargeButton
          type="button"
          leftIcon={
            isExploreMapSpinning ? (
              <SpinnerIcon height={30} />
            ) : (
              <MapAlt height={30} />
            )
          }
          onClick={handleExploreMap}
          disabled={isLocating}
        >
          {t('pages.welcome.explore_the_map')}
        </LargeButton>
      </ButtonWrapper>
      <NavHeader>{t('pages.changes.last_24_hours')}</NavHeader>
      <ActivityGlobe />
      <MobileAppLinks />
      <AboutSection />
      <br />
      <MobileSocialLinks />
      <div ref={bottomRef} />
    </LandingPage>
  )
}

export default withAuthRedirect(HomePage, false)
