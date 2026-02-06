import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Input from './Input'
import ResetButton from './ResetButton'

const TogglePasswordButton = styled(ResetButton)`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  padding: 0 0.5em;

  svg {
    height: 70%;
    width: auto;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EyeIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6" />
    <path d="M12 19c7.63 0 9.93-6.62 9.95-6.68.07-.21.07-.43 0-.63-.02-.07-2.32-6.68-9.95-6.68s-9.93 6.61-9.95 6.67c-.07.21-.07.43 0 .63.02.07 2.32 6.68 9.95 6.68Zm0-12c5.35 0 7.42 3.85 7.93 5-.5 1.16-2.58 5-7.93 5s-7.42-3.84-7.93-5c.5-1.16 2.58-5 7.93-5" />
  </svg>
)

const EyeOffIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-5.35 0-7.42-3.84-7.93-5 .2-.46.65-1.34 1.45-2.23l-1.4-1.4c-1.49 1.65-2.06 3.28-2.08 3.31-.07.21-.07.43 0 .63.02.07 2.32 6.68 9.95 6.68.91 0 1.73-.1 2.49-.26l-1.77-1.77c-.24.02-.47.03-.72.03Zm9.95-4.68c.07-.21.07-.43 0-.63-.02-.07-2.32-6.68-9.95-6.68-1.84 0-3.36.39-4.61.97L2.71 1.29 1.3 2.7l4.32 4.32 1.42 1.42 2.27 2.27 3.98 3.98 1.8 1.8 1.53 1.53 4.68 4.68 1.41-1.41-4.32-4.32c2.61-1.95 3.55-4.61 3.56-4.65m-7.25.97c.19-.39.3-.83.3-1.29 0-1.64-1.36-3-3-3-.46 0-.89.11-1.29.3l-1.8-1.8c.88-.31 1.9-.5 3.08-.5 5.35 0 7.42 3.85 7.93 5-.3.69-1.18 2.33-2.96 3.55z" />
  </svg>
)

const PasswordInput = ({ value, ...props }) => {
  const [visible, setVisible] = useState(false)
  const isEmpty = !value || value.length === 0

  return (
    <Input
      {...props}
      value={value}
      type={visible ? 'text' : 'password'}
      append={
        <TogglePasswordButton
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(!visible)}
          disabled={isEmpty}
        >
          {visible ? EyeOffIcon : EyeIcon}
        </TogglePasswordButton>
      }
    />
  )
}

export default PasswordInput
