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
    height: 90%;
    width: auto;
  }
`

const EyeIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-5.94" />
    <path d="M1 1l22 22" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a21.8 21.8 0 0 1-3.87 5.68" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
  </svg>
)

const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      append={
        <TogglePasswordButton
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(!visible)}
        >
          {visible ? EyeOffIcon : EyeIcon}
        </TogglePasswordButton>
      }
    />
  )
}

export default PasswordInput
