import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const StyledIconButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: 0;
  background-color: white;
  border-radius: 50%;
  border: 2px solid
    ${({ raised, theme }) => (raised ? 'white' : theme.secondaryBackground)};
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
  }
`

const IconButton = ({ size, raised, icon, onClick, label, pressed }) => (
  <StyledIconButton
    aria-label={label}
    size={size}
    raised={raised}
    onClick={onClick}
    pressed={pressed}
  >
    {icon}
  </StyledIconButton>
)

IconButton.propTypes = {
  raised: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  pressed: PropTypes.bool.isRequired,
}

export default IconButton
