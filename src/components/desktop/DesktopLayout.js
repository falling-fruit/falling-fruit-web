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
      <ResizablePane minWidth={310} maxWidth="21.5vw" defaultWidth="21.5vw" />
      <MapPage />
    </MapContainer>
  </DesktopContainer>
)

export default DesktopLayout
