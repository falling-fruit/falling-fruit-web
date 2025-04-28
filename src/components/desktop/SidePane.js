import { Pencil } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import EntryDesktop from '../entry/EntryDesktop'
import { formRoutesDesktop } from '../form/formRoutes'
import SettingsPage from '../settings/SettingsPage'
import BackButton from '../ui/BackButton'
import ReturnIcon from '../ui/ReturnIcon'
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

  svg {
    height: 20px;
    margin-inline-end: 5px;
  }
`

const Header = styled.h3`
  margin-inline-start: 10px;
`

const SidePane = () => {
  const history = useAppHistory()
  const { t } = useTranslation()
  const { review } = useSelector((state) => state.review)
  const {
    locationId,
    isBeingEdited: isEditingLocation,
    fromSettings,
  } = useSelector((state) => state.location)
  const { anchorElementId } = useSelector((state) => state.activity)

  const goToMap = (event) => {
    event.stopPropagation()
    history.push('/map')
  }

  const goToSettings = (event) => {
    event.stopPropagation()
    history.push('/settings')
  }

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
                  onClick={(event) => {
                    event.stopPropagation()
                    if (review) {
                      history.push(`/reviews/${review.id}/edit`)
                    } else if (locationId) {
                      if (isEditingLocation) {
                        history.push(`/locations/${locationId}/edit`)
                      } else {
                        history.push(`/locations/${locationId}`)
                      }
                    } else {
                      history.push('/map')
                    }
                  }}
                >
                  <ReturnIcon />
                  {t('layouts.back')}
                </BackButton>
              </StyledNavBack>
              <Header>{t('menu.settings')}</Header>
              <SettingsPage desktop />
            </Route>
            <Route path="/locations/:locationId">
              {({ match }) =>
                match && (
                  <>
                    <StyledNavBack>
                      <BackButton
                        onClick={
                          fromSettings
                            ? goToSettings
                            : anchorElementId
                              ? () => history.push('/changes')
                              : goToMap
                        }
                      >
                        <ReturnIcon />
                        {t('layouts.back')}
                      </BackButton>
                      <BackButton
                        onClick={() =>
                          history.push(
                            `/locations/${match.params.locationId}/edit`,
                          )
                        }
                      >
                        <Pencil />
                        {t('form.button.edit')}
                      </BackButton>
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
