import { Loader } from '@styled-icons/boxicons-regular'
import { MapAlt } from '@styled-icons/boxicons-solid'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  GeolocationState,
  requestGeolocation,
} from '../../redux/geolocationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import AboutSection from '../mobile/AboutSection'
import Button from '../ui/Button'
import { AuthPage } from '../ui/PageTemplate'
import { withAuthRedirect } from './withAuthRedirect'

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1em;
  margin: 1em 0;
`
const LargeButton = styled(Button)`
  min-height: 2.5em;
  font-size: 1.25em;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 1em !important;
`

const Description = styled.div`
  font-size: 1.25em;
  color: ${({ theme }) => theme.secondaryText};

  text-align: justify;
  padding: 0.5em;
`

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

const WelcomePage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useAppHistory()
  const { geolocation, geolocationState } = useSelector(
    (state) => state.geolocation,
  )

  const handleExploreMap = () => {
    dispatch(requestGeolocation())
  }

  useEffect(() => {
    if (geolocationState === GeolocationState.DENIED) {
      history.push('/map')
    } else if (geolocation?.latitude && geolocation?.longitude) {
      history.push(`/map/@${geolocation.latitude},${geolocation.longitude},16z`)
    }
  }, [geolocation, geolocationState, history])

  return (
    <AuthPage>
      <br />
      <Description>
        <div style={{ fontSize: '1.25em' }}>
          {t('pages.welcome.map_the_urban_harvest')}
        </div>
        <br />
        <div>{t('pages.welcome.join_us_for_produce')}</div>
        <br />
        <div>{t('pages.welcome.our_platform_is_open')}</div>
      </Description>
      <ButtonWrapper>
        <LargeButton
          type="button"
          leftIcon={
            geolocationState === GeolocationState.LOADING ? (
              <SpinnerIcon height={30} />
            ) : (
              <MapAlt height={30} />
            )
          }
          onClick={handleExploreMap}
          disabled={geolocationState === GeolocationState.LOADING}
        >
          {t('pages.welcome.explore_the_map')}
        </LargeButton>
        <LargeButton type="button" secondary>
          <StyledLink to="/auth/sign_in">{t('users.sign_in')}</StyledLink>
        </LargeButton>
      </ButtonWrapper>
      <br />
      <h3>{t('glossary.about')}</h3>
      <AboutSection />
    </AuthPage>
  )
}

export default withAuthRedirect(WelcomePage, false)
