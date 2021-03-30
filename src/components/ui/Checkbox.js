import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import { Check } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components/macro'

const StyledCheck = styled(Check)`
  display: ${({ $checked }) => ($checked ? 'block' : 'none')};
  color: white;
`

const StyledCustomCheckboxContainer = styled(CustomCheckboxContainer)`
  input {
    cursor: pointer;
  }
  display: flex;
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
    border-radius: 1px;
  }
`

const Checkbox = ({ checked, name, onChange, id, ...props }) => (
  <StyledCustomCheckboxContainer
    checked={checked}
    onChange={onChange}
    {...props}
  >
    <CustomCheckboxInput id={id} name={name} />
    {checked === 'mixed' ? <span /> : <StyledCheck $checked={checked} />}
  </StyledCustomCheckboxContainer>
)

export default Checkbox
