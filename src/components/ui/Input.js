import React from 'react'
import styled from 'styled-components'

const Input = React.forwardRef(
  (
    {
      placeholder,
      value,
      onChange,
      onEnter,
      label,
      icon,
      className,
      prepend,
      append,
      ...props
    },
    ref,
  ) => {
    const id = label?.toLowerCase().split(' ').join('-').concat(`-${className}`)

    return (
      <div className={className}>
        {label && <label htmlFor={id}>{label}</label>}
        <div>
          {prepend}
          <input
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
              e.key === 'Enter' && onEnter?.(e)
            }}
            type="text"
            placeholder={placeholder ?? ''}
            id={id}
            ref={ref}
            {...props}
          />
          {icon}
          {append}
        </div>
      </div>
    )
  },
)
Input.displayName = 'Input'

const StyledInput = styled(Input)`
  label {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: bold;
    line-height: 2;
  }

  & > div {
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 23px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    box-sizing: border-box;
    padding: 0 20px;
    padding-left: ${(props) => (props.prepend ? '5px' : 'default')};

    input {
      color: ${({ theme }) => theme.secondaryText};
      font-size: 16px;
      font-family: ${({ theme }) => theme.fonts};
      padding: 0;
      border: none;
      display: block;
      width: 100%;
      outline: none;
      height: 44px;
      padding-left: ${(props) => (props.prepend ? '10px' : 0)};

      &::placeholder {
        color: ${({ theme }) => theme.tertiaryText};
      }
    }

    button {
      background: none;
      color: inherit;
      border: none;
      height: 100%;

      ${
        '' /* // TODO: Find if there is a better way to do this?
       Trying to only have border radius if something is prepended.
       Also, only have border-right if it's a prepend, and only border-left for append
         */
      }
      border-radius: ${(props) => (props.prepend ? '0 50% 50% 0' : 'none')};
      border-right: ${(props) =>
        props.prepend ? '1px solid #e0e1e2' : 'none'};
      border-left: ${(props) => (props.append ? '1px solid #e0e1e2' : 'none')};
    }

    &:focus-within {
      box-shadow: 0 0 0 1pt rgb(0, 95, 204);
      box-shadow: 0 0 0 1pt -webkit-focus-ring-color;
    }

    svg {
      height: 28px;
      width: auto;
      pointer-events: none;
    }
  }
`

export default StyledInput
