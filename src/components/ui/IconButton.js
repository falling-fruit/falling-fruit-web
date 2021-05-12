import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const StyledIconButton = styled(ResetButton)`
  --color: ${({ color, theme }) => color ?? theme.orange};
  --transparent-color: ${({ color, theme }) =>
    transparentize(0.8, color ?? theme.orange)};

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ pressed, theme }) =>
    pressed ? 'var(--transparent-color)' : theme.background};
  border-radius: 50%;
  border: ${({ raised, theme }) =>
    raised
      ? `3px solid ${theme.background}`
      : `1px solid ${theme.secondaryBackground}`};
  ${({ pressed }) => pressed && `border-color: var(--color);`}
  ${({ raised, theme }) => raised && `box-shadow: 0 0 8px 1px ${theme.shadow};`}

  &:focus {
    outline: none;
  }

  svg {
    ${({ raised }) => !raised && 'height: 50%;'}
    ${({ raised, size }) =>
      raised &&
      `border: 3px solid var(--color);
        border-radius: 50%;
        padding: ${size / 20}px;`}

    color: ${({ pressed, raised, theme }) =>
      pressed || raised ? `var(--color)` : theme.secondaryText};
  }
`

const Subscript = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.orange};
  color: ${({ theme }) => theme.background};
  width: 20px;
  height: 20px;
  font-family: ${({ theme }) => theme.fonts};
  font-size: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
`

const IconButton = ({ icon, label, subscript, ...props }) => (
  <StyledIconButton aria-label={label} {...props}>
    {icon}
    {subscript && <Subscript>{subscript}</Subscript>}
  </StyledIconButton>
)

IconButton.propTypes = {
  raised: PropTypes.bool,
  color: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  pressed: PropTypes.bool,
}

export default IconButton
