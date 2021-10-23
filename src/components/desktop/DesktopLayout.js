import WindowSize from '@reach/window-size'
import { Route, Switch } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import styled from 'styled-components/macro'

import ImportedDatasetsPage from '../about/ImportedDatasetsPage'
import Project from '../about/Project'
import MapPage from '../map/MapPage'
import Header from './Header'
import SidePaneSwitch from './SidePaneSwitch'

// Min and max pane width, in pixels
const MIN_PANE_WIDTH = (_vw) => 310
const MAX_PANE_WIDTH = (vw) => Math.max((21.5 * vw) / 100, MIN_PANE_WIDTH(vw))
const DEFAULT_PANE_WIDTH = MAX_PANE_WIDTH

const DesktopContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledSplit = styled(SplitPane)`
  position: relative !important;
  flex: 1;

  .Pane1 {
    z-index: 1;
    box-shadow: 2px 0px 8px ${({ theme }) => theme.shadow};
  }

  .Resizer {
    width: 10px;
    margin: 0 -5px;
    cursor: ${(props) =>
      props.minSize < props.maxSize ? 'col-resize' : 'default'};
    z-index: 1;
  }
`

const MapPane = styled.div`
  width: 100%;
  height: 100%;
`

const DesktopLayout = () => (
  // Hack: must use WindowSize here because react-split-pane doesn't allow for
  // a non-numerical maxSize like "21.5vw"
  <DesktopContainer>
    <Header />
    <Switch>
      <Route exact path="/about/project">
        {console.log('test')}
        {/* <WindowSize> */}
        <Project />
        {/* </WindowSize> */}
      </Route>
      <Route exact path="/about/dataset">
        {/* <WindowSize> */}
        <ImportedDatasetsPage />
        {/* </WindowSize> */}
      </Route>
      <Route>
        <WindowSize>
          {({ width: vw }) => (
            <StyledSplit
              split="vertical"
              minSize={MIN_PANE_WIDTH(vw)}
              maxSize={MAX_PANE_WIDTH(vw)}
              defaultSize={DEFAULT_PANE_WIDTH(vw)}
            >
              <SidePaneSwitch />
              <MapPane>
                <MapPage isDesktop />
              </MapPane>
            </StyledSplit>
          )}
        </WindowSize>
      </Route>
    </Switch>
  </DesktopContainer>
)

export default DesktopLayout
