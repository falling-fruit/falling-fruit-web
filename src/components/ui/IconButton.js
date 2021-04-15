import PropTypes from 'prop-types'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

const StyledIconButton = styled.button`
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: 0;
  background-color: ${({ pressed, theme }) =>
    pressed ? theme.transparentOrange : 'white'};
  border-radius: 50%;
  border: ${({ raised, theme }) =>
    raised ? '2px solid white' : `1px solid ${theme.secondaryBackground}`};
  ${({ pressed, theme }) =>
    pressed &&
    `border-color: ${theme.orange};
	`}
  ${({ raised, theme }) =>
    raised &&
    `box-shadow: 0 0 8px 1px ${theme.shadow};
	`}

  &:focus {
    outline: none;
  }

  svg {
    height: 50%;
    ${({ raised, size }) =>
      raised &&
      css`
        border: 2px solid orange;
        border-radius: 50%;
        padding: ${size / 5}px;
      `}

    color: ${({ pressed, raised, theme }) =>
      pressed ? theme.orange : raised ? theme.orange : theme.secondaryText};
  }
`

const Subscript = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.orange};
  color: white;
  width: 20px;
  height: 20px;
  font-family: ${({ theme }) => theme.fonts};
  font-size: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
`

const IconButton = ({
  size,
  raised,
  icon,
  onClick,
  label,
  pressed,
  subscript,
}) => (
  <StyledIconButton
    aria-label={label}
    size={size}
    raised={raised}
    onClick={onClick}
    pressed={pressed}
  >
    {icon}
    {subscript && <Subscript>{subscript}</Subscript>}
  </StyledIconButton>
)

IconButton.propTypes = {
  raised: PropTypes.bool,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  pressed: PropTypes.bool,
}

export default IconButton
