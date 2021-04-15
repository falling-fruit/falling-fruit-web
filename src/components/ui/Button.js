import styled from 'styled-components/macro'

import { prepend } from './GlobalStyle'

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 14px;
  line-height: 14px;
  color: ${({ $secondary, theme }) =>
    $secondary ? theme.orange : theme.background};
  font-family: inherit;
  font-weight: 700;
  background-color: ${({ $secondary, theme }) =>
    $secondary ? theme.background : theme.orange};
  border: 2px solid ${({ theme }) => theme.orange};
  box-sizing: border-box;
  border-radius: 100px;
  padding: 0 24px;
  cursor: pointer;

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
