import React from 'react'
import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const AddOn = styled.div`
  height: 100%;
  & > * {
    background: none;
    color: inherit;
    border: none;
    height: 100%;
    border-inline-end: ${(props) =>
      props.prepend ? '1px solid #e0e1e2' : 'none'};
    border-inline-start: ${(props) =>
      !props.prepend ? '1px solid #e0e1e2' : 'none'};
  }
`

const Input = React.forwardRef(
  (
    {
      placeholder,
      value,
      onChange,
      onEnter,
      icon,
      className,
      prepend,
      append,
      ...props
    },
    ref,
  ) => (
    <div className={className}>
      <AddOn prepend>{prepend}</AddOn>
      <input
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          e.key === 'Enter' && onEnter?.(e)
        }}
        type="text"
        placeholder={placeholder ?? ''}
        ref={ref}
        {...props}
      />
      {icon}
      <AddOn>{append}</AddOn>
    </div>
  ),
)
Input.displayName = 'Input'

const StyledInput = styled(Input)`
  height: ${(props) => props.height || '46px'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.375em;
  border: 1px solid ${validatedColor()};
  box-sizing: border-box;
  padding-inline-start: ${(props) => (props.prepend ? '5px' : '20px')};
  padding-inline-end: ${(props) => (props.append ? '0' : '20px')};

  input {
    color: ${({ theme }) => theme.secondaryText};
    font-size: 1rem;
    font-family: ${({ theme }) => theme.fonts};
    padding: 0;
    border: none;
    display: block;
    width: 100%;
    outline: none;
    height: calc(100% - 2px);
    padding-inline-start: ${(props) => (props.prepend ? '10px' : '0')};

    &::placeholder {
      color: ${({ theme }) => theme.tertiaryText};
    }
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.blue};
  }

  svg {
    height: 28px;
    width: auto;
    pointer-events: none;
  }
`

export default StyledInput
