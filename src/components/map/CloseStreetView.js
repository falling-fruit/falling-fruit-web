import { X } from '@styled-icons/boxicons-regular'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import BlurredSafeArea from '../mobile/BlurredSafeArea'
import SquareIconButton from '../ui/SquareIconButton'

const StreetViewUIWrapper = styled.div`
  display: flex;
  inset-block-start: max(16px, env(safe-area-inset-top));
  inset-inline-start: 16px;
  justify-content: flex-end;
  position: absolute;
  z-index: 2;
`

const BottomSafeAreaBar = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  height: var(--safe-area-inset-bottom, 0px);
  background: ${({ theme }) => theme.secondaryBackground};
  z-index: 1000;
  pointer-events: none;
`

const CloseStreetView = () => {
  const { googleMap } = useSelector((state) => state.map)

  const handleClose = (event) => {
    event.stopPropagation()
    if (googleMap) {
      const panorama = googleMap.getStreetView()
      panorama.setVisible(false)
    }
  }

  return (
    <>
      <BlurredSafeArea />
      <StreetViewUIWrapper>
        <SquareIconButton
          label="Close street view"
          icon={<X />}
          onClick={handleClose}
        />
      </StreetViewUIWrapper>
      <BottomSafeAreaBar />
    </>
  )
}

export default CloseStreetView
