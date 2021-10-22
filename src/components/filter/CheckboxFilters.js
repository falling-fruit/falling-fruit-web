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
  {
    field: 'showOnMap',
    label: 'Show On Map',
  },
]

const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};

  &:not(:last-child) {
    margin-bottom: 8px;

    @media ${({ theme }) => theme.device.mobile} {
      margin-top: 15px;
    }
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
