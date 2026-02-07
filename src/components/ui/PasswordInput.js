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
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7,6.3" />
    <path d="M17.5,17.5C15.9,18.4,14.1,19,12,19c-7,0-11-7-11-7s1.9-3.4,5.5-5.5" />
    <path d="M10.5,5.1C11,5,11.5,5,12,5c7,0,11,7,11,7s-0.8,1.4-2.3,3" />
    <path d="M14.1,14.1C13.6,14.7,12.8,15,12,15c-1.7,0-3-1.3-3-3c0-0.8,0.3-1.6,0.9-2.1" />
    <path d="M1,1l22,22" />
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
