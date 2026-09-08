import { LeftArrowAlt, RightArrowAlt, X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import SquareIconButton from '../../ui/SquareIconButton'

const TopButtons = styled.div`
  position: absolute;
  inset-block-start: max(16px, env(safe-area-inset-top));
  inset-inline-end: 16px;
  display: flex;
  gap: 10px;
  z-index: 2;
`

const NavButtonContainer = styled.div`
  position: absolute;
  inset-block-end: max(16px, env(safe-area-inset-bottom));
  inset-inline-start: 0;
  inset-inline-end: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  z-index: 2;
`

export const LightboxTopButtons = ({ onClose }) => (
  <TopButtons>
    <SquareIconButton label="Close" icon={<X />} onClick={onClose} />
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
    <SquareIconButton
      disabled={disablePrev}
      onClick={onPrev}
      label="Previous photo"
      icon={isRTL ? <RightArrowAlt /> : <LeftArrowAlt />}
    />
    <SquareIconButton
      disabled={disableNext}
      onClick={onNext}
      label="Next photo"
      icon={isRTL ? <LeftArrowAlt /> : <RightArrowAlt />}
    />
  </NavButtonContainer>
)
