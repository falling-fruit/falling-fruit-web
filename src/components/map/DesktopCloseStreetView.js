import { X } from '@styled-icons/boxicons-regular'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import SquareIconButton from '../ui/SquareIconButton'

const StreetViewUIWrapper = styled.div`
  display: flex;
  inset-block-start: 16px;
  inset-inline-end: 16px;
  justify-content: flex-end;
  position: absolute;
  z-index: 2;
`

const DesktopCloseStreetView = () => {
  const { googleMap } = useSelector((state) => state.map)

  const handleClose = (event) => {
    event.stopPropagation()
    if (googleMap) {
      const panorama = googleMap.getStreetView()
      panorama.setVisible(false)
    }
  }

  return (
    <StreetViewUIWrapper>
      <SquareIconButton
        label="Close street view"
        icon={<X />}
        onClick={handleClose}
      />
    </StreetViewUIWrapper>
  )
}

export default DesktopCloseStreetView
