import Select, { createFilter } from 'react-select'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const LIST_ITEM_HEIGHT = 46

const StyledSelect = styled(Select)`
  font-size: 1rem;

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
    padding: 3px 10px;
  }

  .select__input {
    font-family: ${({ theme }) => theme.fonts};
    color: ${({ theme }) => theme.secondaryText};
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

  .select__menu {
    div:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
    }
  }

  .select__option {
    height: ${LIST_ITEM_HEIGHT}px;
    display: flex;
    align-items: center;
  }
`

/**
 * Wrapper around react-window. This is used to replace the menu list component of react-select.
 */
const MenuList = ({ children, maxHeight }) => (
  <FixedSizeList
    height={maxHeight ? maxHeight : '0px'}
    itemCount={children.length}
    itemSize={LIST_ITEM_HEIGHT}
  >
    {({ index, style }) => <div style={style}>{children[index]}</div>}
  </FixedSizeList>
)

const SelectWrapper = ({ isVirtualized, ...props }) => (
  <StyledSelect
    components={isVirtualized ? { MenuList } : {}}
    classNamePrefix="select"
    // Reduces typing lag
    filterOption={createFilter({ ignoreAccents: false })}
    {...props}
  />
)

export { SelectWrapper as Select }
