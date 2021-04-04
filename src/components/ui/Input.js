import React from 'react'
import styled from 'styled-components/macro'

const AddOn = styled.div`
  height: 100%;
  & > * {
    background: none;
    color: inherit;
    border: none;
    height: 100%;
    border-radius: ${(props) => (props.prepend ? '50% 0 0 50%' : 'none')};
    border-right: ${(props) => (props.prepend ? '1px solid #e0e1e2' : 'none')};
    border-left: ${(props) => (!props.prepend ? '1px solid #e0e1e2' : 'none')};
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
      <AddOn prepend> {prepend} </AddOn>
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
      <AddOn prepend={false}>{append}</AddOn>
    </div>
  ),
)
Input.displayName = 'Input'

const StyledInput = styled(Input)`
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

  &:focus-within {
    box-shadow: 0 0 0 1pt rgb(0, 95, 204);
    box-shadow: 0 0 0 1pt -webkit-focus-ring-color;
  }

  svg {
    height: 28px;
    width: auto;
    pointer-events: none;
  }
`

export default StyledInput
