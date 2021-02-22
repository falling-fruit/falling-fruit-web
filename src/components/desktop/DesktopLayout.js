import styled from 'styled-components'

import MapPage from '../map/MapPage'
import Header from './Header'
import Pane from './Pane'

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
      <Pane />
      <MapPage />
    </MapContainer>
  </DesktopContainer>
)

export default DesktopLayout
