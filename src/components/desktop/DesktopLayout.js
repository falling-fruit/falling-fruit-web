import WindowSize from '@reach/window-size'
import SplitPane from 'react-split-pane'
import styled from 'styled-components'

import MapPage from '../map/MapPage'
import Header from './Header'
import SidePane from './SidePane'

const MAX_PANE_WIDTH = 21.5 // unit is vw

const DesktopContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledSplit = styled(SplitPane)`
  position: relative !important;
  flex: 1;

  .Resizer {
    width: 10px;
    cursor: col-resize;
    z-index: 1;
    box-shadow: 8px 0px 8px -4px rgba(0, 0, 0, 0.12);
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
    <WindowSize>
      {({ width: vw }) => (
        <StyledSplit
          split="vertical"
          minSize={310}
          maxSize={(MAX_PANE_WIDTH / 100) * vw}
          defaultSize={(MAX_PANE_WIDTH / 100) * vw}
        >
          <SidePane />
          <MapPane>
            <MapPage />
          </MapPane>
        </StyledSplit>
      )}
    </WindowSize>
  </DesktopContainer>
)

export default DesktopLayout
