import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'

import aboutRoutes from '../about/aboutRoutes'
import accountRoutes from '../account/accountRoutes'
import activityRoutes from '../activity/activityRoutes'
import authRoutes from '../auth/authRoutes'
import connectRoutes from '../connect/connectRoutes'
import errorRoutes from '../error/errorRoutes'
import MapPage from '../map/MapPage'
import Header from './Header'
import SidePane from './SidePane'
import SplitPane from './SplitPane'

const MIN_PANE_WIDTH = 200
const MAX_PANE_WIDTH = 600
const DEFAULT_PANE_WIDTH = 340

const DesktopContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const SplitContainer = styled.div`
  position: relative;
  flex: 1;
`

const DesktopLayout = () => (
  <DesktopContainer>
    <Header />
    {connectRoutes}
    <Switch>
      {aboutRoutes}
      {activityRoutes}
      {authRoutes}
      {accountRoutes}
      {errorRoutes}
      <Route>
        <SplitContainer>
          <SplitPane
            minSize={MIN_PANE_WIDTH}
            maxSize={MAX_PANE_WIDTH}
            defaultSize={DEFAULT_PANE_WIDTH}
          >
            <SidePane />
            <MapPage isDesktop />
          </SplitPane>
        </SplitContainer>
      </Route>
    </Switch>
  </DesktopContainer>
)

export default DesktopLayout
