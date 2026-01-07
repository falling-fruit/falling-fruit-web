import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import EntryDesktop from '../entry/EntryDesktop'
import TopButtonsDesktop from '../entry/TopButtonsDesktop'
import { formRoutesDesktop } from '../form/formRoutes'
import SettingsPage from '../settings/SettingsPage'
import { BackButton } from '../ui/ActionButtons'
import MainSidePane from './MainSidePane'
import SettingsButton from './SettingsButton'

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
  padding-block: 25px 15px;
  padding-inline: 10px 15px;
  display: flex;
  justify-content: space-between;
`

const Header = styled.h3`
  margin-inline-start: 10px;
`

const SidePane = () => {
  const history = useAppHistory()
  const { t } = useTranslation()
  const { review, form: reviewForm } = useSelector((state) => state.review)
  const {
    locationId,
    isBeingEdited: isEditingLocation,
    fromSettings,
  } = useSelector((state) => state.location)
  const { id: recentChangesSectionId } = useSelector(
    (state) => state.activity.recentChanges.lastBrowsedSection,
  )
  const { userId: userActivityUserId } = useSelector(
    (state) => state.activity.userActivityLastBrowsedSection,
  )

  return (
    <FullHeightPane>
      <Switch>
        <Route exact path={['/map', '/list', '/', '/map/:geocoord']}>
          <MainSidePane />
        </Route>
        <Route>
          <Switch>
            {formRoutesDesktop}
            <Route path="/settings">
              <StyledNavBack>
                <BackButton
                  backPath={
                    review
                      ? `/reviews/${review.id}/edit`
                      : locationId && reviewForm
                        ? `/locations/${locationId}/review`
                        : locationId && isEditingLocation
                          ? `/locations/${locationId}/edit`
                          : locationId
                            ? `/locations/${locationId}`
                            : '/map'
                  }
                />
              </StyledNavBack>
              <Header>{t('menu.settings')}</Header>
              <SettingsPage isDesktop />
            </Route>
            <Route path="/locations/:locationId">
              {({ match }) =>
                match && (
                  <>
                    <StyledNavBack>
                      <BackButton
                        backPath={
                          fromSettings
                            ? '/settings'
                            : userActivityUserId
                              ? `/users/${userActivityUserId}/activity`
                              : recentChangesSectionId
                                ? '/changes'
                                : '/map'
                        }
                      />
                      <TopButtonsDesktop />
                    </StyledNavBack>
                    <EntryDesktop />
                  </>
                )
              }
            </Route>
            <Route>
              <Redirect to={pathWithCurrentView('/map')} />
            </Route>
          </Switch>
        </Route>
      </Switch>
      <Switch>
        <Route path="/locations/:locationId/edit"></Route>
        <Route path="/locations/:locationId/review"></Route>
        <Route path="/locations/new"></Route>
        <Route path="/reviews/:reviewId/edit"></Route>
        <Route path="/settings"></Route>
        <Route>
          <SettingsButton onClick={() => history.push('/settings')} />
        </Route>
      </Switch>
    </FullHeightPane>
  )
}

export default SidePane
