import { transparentize } from 'polished'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const StyledResetButton = styled(ResetButton)`
  height: 100px;
  width: 100px;
  background-color: #c4c4c4;
  position: relative;
  border-block-end: 5px solid
    ${({ $selected, theme }) => ($selected ? theme.orange : theme.background)};
  overflow: hidden;
  text-align: start;

  &::before {
    content: '';
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent,
      ${({ theme }) => transparentize(0.15, theme.headerText)}
    );
  }

  p {
    position: absolute;
    inset-inline-start: 6px;
    inset-block-end: 5px;
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

const TileButton = ({ label, children, ...props }) => (
  <StyledResetButton {...props}>
    <p>{label}</p>
    {children}
  </StyledResetButton>
)

export default TileButton
