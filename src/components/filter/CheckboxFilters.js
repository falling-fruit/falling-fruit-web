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

const Field = styled.label`
  display: block;
`

const CheckboxFilters = ({ values, onChange }) =>
  CHECKBOX_FIELDS.map(({ field, label }) => (
    <Field key={field} htmlFor={field}>
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
    </Field>
  ))

export default CheckboxFilters
