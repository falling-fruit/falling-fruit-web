import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import React from 'react'
import styled from 'styled-components'

const Checkbox = React.forwardRef(({ ...props }, ref) => (
  <div>
    <CustomCheckboxContainer>
      <CustomCheckboxInput
        ref={ref}
        checked={props.checked}
        onChange={props.onChange}
        {...props}
      />
      <span aria-hidden />
    </CustomCheckboxContainer>
  </div>
))
Checkbox.displayName = 'Checkbox'

const StyledCheckbox = styled(Checkbox)`

    CustomCheckboxContainer {
      color: ${({ theme }) => theme.background};
      background: ${(props) => {
        if (props.checked) {
          return ({ theme }) => theme.orange
        } else if (!props.checked) {
          return ({ theme }) => theme.transparentOrange
        } else {
          return ({ theme }) => theme.transparentOrange
        }
      }};
      border: 2.57143px solid #FFA41B;
      box-sizing: border-box;
      border-radius: 3.42857px;
    }

    span {
      display: "block";
      position: "absolute";
      width: "60%";
      height: "60%";
      top: "50%";
      left: "50%";
      transition: "transform 200ms ease-out, background 200ms ease-out",
      zIndex: 1,
      background: ${(props) => {
        if (props.checked) {
          return ({ theme }) => theme.orange
        } else if (!props.checked) {
          return ({ theme }) => theme.orange
        } else {
          return ({ theme }) => theme.transparentOrange
        }
      }};
      transform: ${(props) => {
        if (props.checked) {
          return '`translate(-50%, -50%) scaleX(1) scaleY(1)`'
        } else if (!props.checked) {
          return '`translate(-50%, -50%) scaleX(0) scaleY(0.4)`'
        }
      }};
    }

    svg {
      height: 28px;
      width: auto;
      pointer-events: none;
    }
  }
`

export default StyledCheckbox
