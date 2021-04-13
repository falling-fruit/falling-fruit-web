import React from 'react'
import Select, { createFilter } from 'react-select'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const StyledSelect = styled(Select)`
  .select__clear-indicator,
  .select__indicator-separator {
    display: none;
  }

  .select__dropdown-indicator {
    color: ${({ theme }) => theme.headerText};
  }

  .select__control {
    border: 1px solid ${validatedColor()};
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

const LIST_ITEM_HEIGHT = 35

/**
 * Wrapper around react-window. This is used to replace the menu list component of react-select.
 */
const MenuList = ({ children, maxHeight }) => (
  <List
    height={maxHeight}
    itemCount={children.length}
    itemSize={LIST_ITEM_HEIGHT}
  >
    {({ index, style }) => <div style={style}>{children[index]}</div>}
  </List>
)

const SelectWrapper = ({ options, placeholder, onChange, isMulti }) => (
  <StyledSelect
    components={{ MenuList }}
    className="select-container"
    classNamePrefix="select"
    options={options}
    isMulti={isMulti}
    placeholder={placeholder}
    onChange={onChange}
    // Reduces typing lag
    filterOption={createFilter({ ignoreAccents: false })}
  />
)

export { SelectWrapper }
