import { X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components'

import { theme, validatedColor } from '../ui/GlobalStyle'
import ResetButton from './ResetButton'

const StyledInput = styled.input`
  flex-grow: 1;
  border: 1px solid ${validatedColor()};
  border-radius: 0.375em;
  margin-inline-end: 0.25em;
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

const DateInput = ({ value, onChange, onClear, ...props }) => (
  <div>
    <StyledInput
      type="date"
      value={value ?? ''}
      onChange={onChange}
      {...props}
    />
    <ResetButton
      type="button"
      onClick={onClear}
      aria-label="Clear date"
      style={{ visibility: value ? 'visible' : 'hidden' }}
    >
      <X size="1.6em" color={theme.tertiaryText} />
    </ResetButton>
  </div>
)

export default DateInput
