import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import React from 'react'
import styled from 'styled-components'

const Checkbox = React.forwardRef(({ ...props }, ref) => (
  <div>
    <CustomCheckboxContainer style={}>
      <CustomCheckboxInput
        ref={ref}
        checked={props.checked}
        onChange={props.onChange}
        {...props}
        style={{ width: '15px', height: '15px' }}
      />
      <span aria-hidden style={{ width: '15px', height: '15px' }} />
    </CustomCheckboxContainer>
  </div>
))
Checkbox.displayName = 'Checkbox'

const StyledCheckbox = styled(Checkbox)`
  label {
    color: ${({ theme }) => theme.secondaryText}; afefse
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
  }
`

export default StyledCheckbox
