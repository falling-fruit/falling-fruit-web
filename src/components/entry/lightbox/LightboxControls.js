import {
  ExitFullscreen,
  LeftArrowAlt,
  RightArrowAlt,
  X,
} from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ResetButton from '../../ui/ResetButton'
import RoundIconButton from '../../ui/RoundIconButton'

const TopButtons = styled.div`
  position: absolute;
  inset-block-start: max(10px, env(safe-area-inset-top));
  inset-inline-end: 10px;
  display: flex;
  gap: 10px;
  z-index: 2;
`

const TopButton = styled(RoundIconButton)`
  svg {
    height: 65%;
  }

  &:disabled svg {
    color: grey;
  }
`

const NavButtonContainer = styled.div`
  position: absolute;
  inset-block-end: max(16px, env(safe-area-inset-bottom));
  inset-inline-start: 0;
  inset-inline-end: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 2;
`

const NavButton = styled(ResetButton)`
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 0.375em;
  background: rgba(0, 0, 0, 0.65);
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    color: grey;
  }
`

export const LightboxTopButtons = ({ canZoomOut, onZoomOut, onClose }) => (
  <TopButtons>
    <TopButton
      label="Zoom out"
      icon={<ExitFullscreen />}
      disabled={!canZoomOut}
      onClick={onZoomOut}
    />
    <TopButton label="Close" icon={<X />} onClick={onClose} />
  </TopButtons>
)

export const LightboxNavButtons = ({
  isRTL = false,
  disablePrev,
  disableNext,
  onPrev,
  onNext,
}) => (
  <NavButtonContainer>
    <NavButton
      disabled={disablePrev}
      onClick={onPrev}
      aria-label="Previous photo"
    >
      {isRTL ? <RightArrowAlt size={30} /> : <LeftArrowAlt size={30} />}
    </NavButton>
    <NavButton disabled={disableNext} onClick={onNext} aria-label="Next photo">
      {isRTL ? <LeftArrowAlt size={30} /> : <RightArrowAlt size={30} />}
    </NavButton>
  </NavButtonContainer>
)
