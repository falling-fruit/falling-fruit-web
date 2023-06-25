import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'

const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
`

const CheckboxFilters = ({ values, onChange, fields, style }) =>
  fields.map(({ field, label }) => (
    <StyledLabel key={field} htmlFor={field} style={style}>
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

export { CheckboxFilters }
