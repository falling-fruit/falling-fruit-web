import { darken } from 'polished'
import styled from 'styled-components/macro'

import { prepend } from './GlobalStyle'
import ResetButton from './ResetButton'

const StyledButton = styled(ResetButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  line-height: 0.375rem;
  font-size: 0.875rem;
  color: ${({ $secondary, theme }) =>
    $secondary ? theme.orange : theme.background};
  font-weight: bold;
  background-color: ${({ $secondary, theme }) =>
    $secondary ? theme.background : theme.orange};
  border: 2px solid ${({ theme }) => theme.orange};
  box-sizing: border-box;
  border-radius: 100px;
  padding: 0 24px;
  // TODO: make raised and add a location button in main pane

  @media ${({ theme }) => theme.device.desktop} {
    :hover:enabled {
      background: ${({ $secondary, theme }) =>
        $secondary ? theme.orange : darken(0.1, theme.orange)};
      border-color: ${({ $secondary, theme }) =>
        $secondary ? theme.orange : darken(0.1, theme.orange)};
      color: ${({ theme }) => theme.background};
    }
  }

  :disabled {
    opacity: 0.6;
  }

  svg {
    height: 1em;
    width: 1em;
    fill: currentColor;
  }
`

const Icon = styled.span`
  ${prepend('margin', '0.25em')}
`

// TODO: forward ref and remaining props in all UI components, rather than taking specific props
const Button = ({
  secondary = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => (
  <StyledButton $secondary={secondary} {...props}>
    {leftIcon && <Icon $prepend>{leftIcon}</Icon>}
    {children}
    {rightIcon && <Icon>{rightIcon}</Icon>}
  </StyledButton>
)

export default Button
