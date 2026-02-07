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
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {/* https://lucide.dev/icons/eye */}
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
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
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* https://lucide.dev/icons/eye-off */}
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
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
