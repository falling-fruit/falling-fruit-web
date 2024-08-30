import { ArrowBack, Pencil } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import Entry from '../entry/Entry'
import { EditLocationForm } from '../form/EditLocation'
import { EditReviewForm } from '../form/EditReview'
import { LocationForm } from '../form/LocationForm'
import SettingsPage from '../settings/SettingsPage'
import BackButton from '../ui/BackButton'
import { SettingsAccordionButton } from '../ui/SettingsAccordion'
import MainSidePane from './MainSidePane'

const SettingsButton = styled(SettingsAccordionButton).attrs((props) => ({
  ...props,
  forwardedAs: 'button',
}))`
  padding: 5px 0;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
`

const FullHeightPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  > div:nth-last-child(2) {
    overflow: auto;
    flex: 1;
  }
`

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

const SidePane = () => {
  const history = useAppHistory()
  const { t } = useTranslation()
  const { review } = useSelector((state) => state.review)

  const goToMap = (event) => {
    event.stopPropagation()
    history.push('/map')
  }
  const goBack = (event) => {
    event.stopPropagation()
    history.goBack()
  }

  return (
    <FullHeightPane>
      <Switch>
        <Route exact path={['/map', '/list', '/', '/map/:geocoord']}>
          <MainSidePane />
        </Route>
        <Route>
          <Switch>
            <Route path="/reviews/:reviewId/edit">
              <StyledNavBack>
                <BackButton
                  onClick={(event) => {
                    event.stopPropagation()
                    history.push(`/locations/${review?.location_id}`)
                  }}
                >
                  <ArrowBack />
                  {t('back')}
                </BackButton>
              </StyledNavBack>
              <Header>Editing My Review</Header>
              <EditReviewForm />
            </Route>
            <Route path="/locations/:locationId/edit">
              {({ match }) => (
                <>
                  <StyledNavBack>
                    <BackButton
                      onClick={(event) => {
                        event.stopPropagation()
                        history.push(`/locations/${match.params.locationId}`)
                      }}
                    >
                      <ArrowBack />
                      {t('back')}
                    </BackButton>
                  </StyledNavBack>
                  <Header>Editing Location</Header>
                  <EditLocationForm />
                </>
              )}
            </Route>
            <Route path="/locations/new">
              <StyledNavBack>
                <BackButton onClick={goToMap}>
                  <ArrowBack />
                  {t('back')}
                </BackButton>
              </StyledNavBack>
              <Header>Adding Location</Header>
              <LocationForm />
            </Route>
            <Route path="/settings">
              <StyledNavBack>
                <BackButton onClick={goBack}>
                  <ArrowBack />
                  {t('back')}
                </BackButton>
              </StyledNavBack>
              <Header>{t('settings')}</Header>
              <SettingsPage desktop />
            </Route>
            <Route path="/locations/:locationId">
              {({ match }) =>
                match && (
                  <>
                    <StyledNavBack>
                      <BackButton onClick={goToMap}>
                        <ArrowBack />
                        {t('back')}
                      </BackButton>
                      <BackButton
                        onClick={() =>
                          history.push(
                            `/locations/${match.params.locationId}/edit`,
                          )
                        }
                      >
                        <Pencil />
                        {t('glossary.edit')}
                      </BackButton>
                    </StyledNavBack>
                    <Entry />
                  </>
                )
              }
            </Route>
            <Route>
              <Redirect to="/map" />
            </Route>
          </Switch>
        </Route>
      </Switch>
      <Switch>
        <Route path="/settings"></Route>
        <Route>
          <SettingsButton
            text={t('settings')}
            onClick={() =>
              history.push({
                pathname: '/settings',
                state: { fromPage: '/map' },
              })
            }
          />
        </Route>
      </Switch>
    </FullHeightPane>
  )
}

export default SidePane
