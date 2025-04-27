import { useTranslation } from 'react-i18next'
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

const LabeledCheckbox = ({ field, value, onChange, label, style }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  return (
    <StyledLabel htmlFor={field} style={style}>
      <Checkbox
        id={field}
        checked={value}
        name={field}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span style={isRTL ? { marginRight: '0.25em' } : {}}>{label}</span>
    </StyledLabel>
  )
}

export default LabeledCheckbox
