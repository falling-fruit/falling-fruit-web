import React from 'react'
import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'

const CHECKBOX_FIELDS = [
  {
    field: 'muni',
    label: 'Municipal Tree Inventories',
  },
  {
    field: 'invasive',
    label: 'Invasive Species Only',
  },
]

const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

const CheckboxFilters = ({ values, onChange }) =>
  CHECKBOX_FIELDS.map(({ field, label }) => (
    <StyledLabel key={field} htmlFor={field}>
      <Checkbox
        id={field}
        checked={values[field]}
        name={field}
        onChange={(event) =>
          onChange({
            ...values,
            [field]: event.target.checked,
          })
        }
      />
      {label}
    </StyledLabel>
  ))

export default CheckboxFilters
