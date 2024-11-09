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

const LabeledCheckbox = ({ field, value, onChange, label, style }) => (
  <StyledLabel htmlFor={field} style={style}>
    <Checkbox
      id={field}
      checked={value}
      name={field}
      onChange={(event) => onChange(event.target.checked)}
    />
    {label}
  </StyledLabel>
)

export default LabeledCheckbox
