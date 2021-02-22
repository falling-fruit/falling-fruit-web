import styled from 'styled-components'

import MapPage from '../map/MapPage'
import ResizablePane from '../ui/ResizablePane'
import Header from './Header'

const DesktopContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled.main`
  position: relative;
  flex: 1;
`

const MapContainer = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  width: calc(100% - 310px);
`

const DesktopLayout = () => (
  <DesktopContainer>
    <Header />
    <ContentContainer>
      <ResizablePane minWidth={310} maxWidth="21.5vw" $defaultWidth="21.5vw" />
      <MapContainer>
        <MapPage />
      </MapContainer>
    </ContentContainer>
  </DesktopContainer>
)

export default DesktopLayout
