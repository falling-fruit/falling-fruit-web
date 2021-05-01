import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import styled from 'styled-components/macro'

const StyledCheckmark = styled.div`
  display: ${({ $checked }) => !$checked && 'none'};
  height: 100%;
  width: 100%;
  background: url('/checkmark/checkmark.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const StyledCustomCheckboxContainer = styled(CustomCheckboxContainer)`
  input {
    cursor: pointer;
  }
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${({ theme }) => theme.orange};
  border-radius: 4px;
  background: ${({ checked, theme }) =>
    checked && checked !== 'mixed' ? theme.orange : theme.transparentOrange};

  & > span {
    width: 60%;
    height: 60%;
    z-index: 1;
    background: ${({ theme }) => theme.orange};
  }
`

const Checkbox = ({ checked, name, onChange, id, ...props }) => (
  <StyledCustomCheckboxContainer
    checked={checked}
    onChange={onChange}
    {...props}
  >
    <CustomCheckboxInput id={id} name={name} />
    {checked === 'mixed' ? <span /> : <StyledCheckmark $checked={checked} />}
  </StyledCustomCheckboxContainer>
)

export default Checkbox
