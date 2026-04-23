import { Map, Pencil } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const IconWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`

const MarkerIcon = styled(Map)`
  width: 100%;
  height: 100%;
`

const PencilOverlay = styled(Pencil)`
  position: absolute;
  width: 12px;
  height: 12px;
  bottom: -2px;
  right: -2px;
  background: white;
  border-radius: 50%;
`

const PositionEditIcon = () => (
  <IconWrapper>
    <MarkerIcon />
    <PencilOverlay />
  </IconWrapper>
)

export default PositionEditIcon
