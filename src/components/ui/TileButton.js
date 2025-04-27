import { transparentize } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const StyledResetButton = styled(ResetButton)`
  height: 100px;
  width: 100px;
  background-color: #c4c4c4;
  position: relative;
  border-bottom: 5px solid
    ${({ $selected, theme }) => ($selected ? theme.orange : theme.background)};
  overflow: hidden;
  text-align: left;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent,
      ${({ theme }) => transparentize(0.15, theme.headerText)}
    );
  }

  p {
    position: absolute;
    ${({ $isRTL }) => ($isRTL ? 'right: 6px;' : 'left: 6px;')}
    bottom: 5px;
    margin: 0;
    font-size: 0.875rem;
    font-weight: bold;
    color: ${({ theme }) => theme.background};
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.375em;
  }
`

const TileButton = ({ label, children, ...props }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <StyledResetButton $isRTL={isRTL} {...props}>
      <p>{label}</p>
      {children}
    </StyledResetButton>
  )
}

export default TileButton
