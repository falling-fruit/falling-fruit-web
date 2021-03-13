import styled from 'styled-components'

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-items: center;
  height: 36px;
  font-size: 14px;
  color: ${({ secondary, theme }) =>
    secondary ? theme.orange : theme.background};
  font-weight: 700;
  background-color: ${({ secondary, theme }) =>
    secondary ? theme.background : theme.orange};
  border: 2px solid ${({ theme }) => theme.orange};
  box-sizing: border-box;
  border-radius: 100px;
  padding: 0 24px;
  cursor: pointer;

  svg {
    height: 1em;
    width: 1em;
    fill: currentColor;
    margin-right: 0.25em;
  }
`

// TODO: forward ref and remaining props in all UI components, rather than taking specific props
const Button = ({ onClick, secondary = false, icon, children }) => (
  <StyledButton onClick={onClick} secondary={secondary}>
    {icon}
    {children}
  </StyledButton>
)

export default Button
