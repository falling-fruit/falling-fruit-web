import styled from 'styled-components'

import { validatedColor } from '../ui/GlobalStyle'

const StyledInput = styled.input`
  flex-grow: 1;
  border: 1px solid ${validatedColor()};
  border-radius: 0.375em;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.blue};
  }
  &:hover {
    border-color: ${({ theme }) => theme.text};
    cursor: text;
  }
  &::-webkit-calendar-picker-indicator {
    // not on Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1812397
    cursor: pointer;
  }
`

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0 8px;
  cursor: pointer;
  font-size: 16px;
`

const DateInput = ({ value, onChange, onClear, ...props }) => (
  <div>
    <StyledInput
      type="date"
      value={value ?? ''}
      onChange={onChange}
      {...props}
    />
    {value && (
      <ClearButton type="button" onClick={onClear} aria-label="Clear date">
        ✕
      </ClearButton>
    )}
  </div>
)

export default DateInput
