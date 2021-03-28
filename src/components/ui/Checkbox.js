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
  border: 3px solid ${({ theme }) => theme.orange};
  border-radius: 4px;
  background: ${({ checked, theme }) =>
    checked ? theme.orange : theme.transparentOrange};
`

const Checkbox = ({ checked, name, onChange, id, ...props }) => (
  <StyledCustomCheckboxContainer
    checked={checked}
    onChange={onChange}
    {...props}
  >
    <CustomCheckboxInput id={id} name={name} />
    <StyledCheck $checked={checked} />
  </StyledCustomCheckboxContainer>
)

export default Checkbox
