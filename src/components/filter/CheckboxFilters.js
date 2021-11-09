import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'

const MUNI_AND_INVASIVE_CHECKBOX_FIELDS = [
  {
    field: 'muni',
    label: 'Municipal Tree Inventories',
  },
  {
    field: 'invasive',
    label: 'Invasive Species Only',
  },
]

const TREE_SHOW_CHECKBOX_FIELDS = [
  {
    field: 'showOnlyOnMap',
    label: 'Only On Map',
  },
]

const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
`

const CheckboxFilters = ({ values, onChange, fields }) =>
  fields.map(({ field, label }) => (
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

export {
  CheckboxFilters,
  MUNI_AND_INVASIVE_CHECKBOX_FIELDS,
  TREE_SHOW_CHECKBOX_FIELDS,
}
