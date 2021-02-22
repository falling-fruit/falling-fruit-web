import styled from 'styled-components'

import MapPage from '../map/MapPage'
import Header from './Header'

const DesktopContainer = styled.div`
  height: 100%;
`

const MapContainer = styled.div`
  height: 100%;
`

const DesktopLayout = () => (
  <DesktopContainer>
    <Header />
    <MapContainer>
      <MapPage />
    </MapContainer>
  </DesktopContainer>
)

export default DesktopLayout
