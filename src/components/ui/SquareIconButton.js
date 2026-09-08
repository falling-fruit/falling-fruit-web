import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

export const OVERLAY_BACKGROUND = 'rgba(0, 0, 0, 0.65)'

const StyledSquareIconButton = styled(ResetButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: none;
  border-radius: 0.375em;
  background: ${OVERLAY_BACKGROUND};
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};
  color: #ffffff;

  svg {
    width: 55%;
    height: 55%;
    color: #ffffff;
  }

  &:disabled,
  &:disabled svg {
    color: grey;
  }
`

const SquareIconButton = ({ icon, label, ...props }) => (
  <StyledSquareIconButton aria-label={label} {...props}>
    {icon}
  </StyledSquareIconButton>
)

SquareIconButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.number,
}

SquareIconButton.defaultProps = {
  size: 50,
}

export default SquareIconButton
