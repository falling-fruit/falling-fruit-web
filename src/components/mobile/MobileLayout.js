import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  EMBED_HEADER_HEIGHT_PX,
  NAVIGATION_BAR_HEIGHT_PX,
  TABS_HEIGHT_PX,
} from '../../constants/mobileLayout'
import { useIsEmbed } from '../../utils/useBreakpoint'
import aboutRoutes from '../about/aboutRoutes'
import accountRoutes from '../account/accountRoutes'
import activityRoutes from '../activity/activityRoutes'
import authRoutes from '../auth/authRoutes'
import connectRoutes from '../connect/connectRoutes'
import EmbedHeader from '../embed/EmbedHeader'
import EntryMobile from '../entry/EntryMobile'
import { formRoutesMobile } from '../form/formRoutes'
import ListPage from '../list/ListPage'
import MapPage from '../map/MapPage'
import SettingsPage from '../settings/SettingsPage'
import { zIndex } from '../ui/GlobalStyle'
import { PageTabs, TabList, TabPanels } from '../ui/PageTabs'
import TopBar from '../ui/TopBar'
import usersRoutes from '../users/usersRoutes'
import EditLocationPositionNav from './EditLocationPositionNav'
import InitLocationNav from './InitLocationNav'
import NavigationBar from './NavigationBar'
import Tabs from './Tabs'

const MapContainer = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: absolute;
  inset-block-start: ${(props) =>
    props.isEmbed ? 0 : NAVIGATION_BAR_HEIGHT_PX}px;
  inset-block-end: ${(props) => (props.isEmbed ? 0 : TABS_HEIGHT_PX)}px;
  inset-inline: 0;
`

const ListPageWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  margin-block-start: ${(props) =>
    props.isEmbed ? EMBED_HEADER_HEIGHT_PX : NAVIGATION_BAR_HEIGHT_PX}px;
  padding-top: 4px;
`

const shouldDisplayMapPage = (pathname) => {
  if (matchPath(pathname, { path: '/map', exact: false, strict: false })) {
    return true
  }

  const match = matchPath(pathname, {
    path: [
      '/locations/:locationId/:nextSegment/:nextNextSegment',
      '/locations/:locationId/:nextSegment',
      '/locations/:locationId',
    ],
    exact: false,
    strict: false,
  })

  const isPlacingNewLocationMarker = match?.params.locationId === 'init'

  const locationId =
    match?.params.locationId && parseInt(match.params.locationId)
  const isViewingLocation =
    locationId && match.params.nextSegment?.indexOf('@') === 0

  const isEditingLocationMarker =
    locationId &&
    match.params.nextSegment === 'edit' &&
    match.params.nextNextSegment === 'position'

  const isViewingPanorama =
    locationId && match.params.nextSegment === 'panorama'

  const isSuccessfullyAdded =
    locationId && match.params.nextSegment === 'success'

  return (
    isPlacingNewLocationMarker ||
    isEditingLocationMarker ||
    isViewingLocation ||
    isViewingPanorama ||
    isSuccessfullyAdded
  )
}

const MobileLayout = () => {
  const streetView = useSelector((state) => state.location.streetViewOpen)
  const { pathname } = useLocation()
  const { tabIndex, handleTabChange, tabContent } = Tabs()
  const isEmbed = useIsEmbed()

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>
      <PageTabs index={tabIndex} onChange={handleTabChange}>
        <Switch>
          <Route path={['/map', '/settings', '/list']}>
            {isEmbed && <EmbedHeader />}
          </Route>
        </Switch>
        <Switch>{formRoutesMobile}</Switch>
        <MapContainer show={shouldDisplayMapPage(pathname)} isEmbed={isEmbed}>
          <MapPage />
        </MapContainer>
        {connectRoutes}
        <Switch>
          <Route
            path={[
              '/reviews/:reviewId/edit',
              '/locations/:locationId/review',
              '/locations/new',
            ]}
          />
          <Route>
            <Switch>
              <Route path="/locations/init">
                <TopBar>
                  <InitLocationNav />
                </TopBar>
              </Route>
              <Route path="/locations/:locationId/edit/position">
                <TopBar>
                  <EditLocationPositionNav />
                </TopBar>
              </Route>
              <Route path="/locations/:locationId/edit" />
              <Route
                path={['/map', '/list', '/locations/:locationId']}
                component={isEmbed ? null : NavigationBar}
              />
            </Switch>
            <TabPanels>
              <Switch>
                {activityRoutes}
                {aboutRoutes}
                {authRoutes}
                {accountRoutes}
                {usersRoutes}
                <Route path={['/map', '/locations', '/list', '/settings']}>
                  <Switch>
                    <Route path="/locations/init" />
                    <Route path="/locations/:locationId/edit" />
                    <Route path="/locations/:locationId">
                      {!streetView && <EntryMobile />}
                    </Route>
                  </Switch>
                  <Switch>
                    <Route path="/list">
                      <ListPageWrapper isEmbed={isEmbed}>
                        <ListPage />
                      </ListPageWrapper>
                    </Route>
                    <Route path="/settings">
                      <SettingsPage isEmbed={isEmbed} />
                    </Route>
                  </Switch>
                </Route>
              </Switch>
            </TabPanels>
            <Switch>
              <Route path={'/users'} />
              <Route path={['/locations/:locationId/edit/:postfix', '*']}>
                {({ match }) =>
                  !isEmbed &&
                  (!match.params.postfix ||
                    match.params.postfix === 'position') && (
                    <>
                      <div style={{ paddingBlockEnd: `${TABS_HEIGHT_PX}px` }} />
                      <TabList
                        style={{
                          zIndex: zIndex.mobileTablist,
                          position: 'fixed',
                          width: '100%',
                          insetBlockEnd: 0,
                          height: `${TABS_HEIGHT_PX}px`,
                        }}
                      >
                        {tabContent}
                      </TabList>
                    </>
                  )
                }
              </Route>
            </Switch>
          </Route>
        </Switch>
      </PageTabs>
    </>
  )
}

export default MobileLayout
