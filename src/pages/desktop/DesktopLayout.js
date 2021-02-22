import styled from 'styled-components'

import DesktopHeader from '../../components/DesktopHeader'
import MapPage from '../MapPage'

const DesktopContainer = styled.div`
  height: 100%;
`

const DesktopLayout = () => (
  <DesktopContainer>
    <DesktopHeader />
    <MapPage />
  </DesktopContainer>
)

export default DesktopLayout
