import styled from 'styled-components'

import MapPage from '../map/MapPage'
import ResizablePane from '../ui/ResizablePane'
import Header from './Header'

const DesktopContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MapContainer = styled.div`
  position: relative;
  flex: 1;
`

const DesktopLayout = () => (
  <DesktopContainer>
    <Header />
    <MapContainer>
      <ResizablePane defaultWidth="21.5vw" minWidth={310} maxWidth="34.75vw" />
      <MapPage />
    </MapContainer>
  </DesktopContainer>
)

export default DesktopLayout
