import React from 'react'
import Select from 'react-select'
import styled from 'styled-components/macro'

const StyledSelect = styled(Select)`
  .select__indicators {
    display: none;
  }

  .select__control {
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 23px;
    padding: 6px 7px;
  }

  .select__placeholder {
    color: ${({ theme }) => theme.text};
  }

  .select__multi-value {
    background-color: ${({ theme }) => theme.transparentOrange};
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;

    &__label {
      color: ${({ theme }) => theme.tag.access};
      padding: 0;
    }

    &__remove {
      display: none;
    }
  }
`

const SelectWrapper = ({ options, placeholder }) => (
  <StyledSelect
    className="select-container"
    classNamePrefix="select"
    options={options}
    isMulti
    placeholder={placeholder}
  />
)

export { SelectWrapper }
