import WindowSize from '@reach/window-size'
import SplitPane from 'react-split-pane'
import styled from 'styled-components/macro'

import MapPage from '../map/MapPage'
import Header from './Header'
import SidePaneSwitch from './SidePaneSwitch'

// Min and max pane width, in pixels
const MIN_PANE_WIDTH = () => 310
const MAX_PANE_WIDTH = (vw) => (21.5 * vw) / 100
const DEFAULT_PANE_WIDTH = (vw) =>
  Math.max(MAX_PANE_WIDTH(vw), MIN_PANE_WIDTH(vw))

const DesktopContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledSplit = styled(SplitPane)`
  position: relative !important;
  flex: 1;
  // TODO: ask Siraj to fix box-shadow here. Side pane overlay needs a shadow

  .Resizer {
    width: 10px;
    margin: 0 -5px;
    cursor: col-resize;
    z-index: 1;
    opacity: 0;
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
          minSize={MIN_PANE_WIDTH(vw)}
          maxSize={MAX_PANE_WIDTH(vw)}
          defaultSize={DEFAULT_PANE_WIDTH(vw)}
        >
          <SidePaneSwitch />
          <MapPane>
            <MapPage />
          </MapPane>
        </StyledSplit>
      )}
    </WindowSize>
  </DesktopContainer>
)

export default DesktopLayout
