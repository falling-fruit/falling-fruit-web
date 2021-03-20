import 'react-dropdown-tree-select/dist/styles.css'

import React from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import styled from 'styled-components/macro'

/* TODO: Checkbox styling */
const TreeSelectContainer = styled.div`
  .dropdown-trigger.arrow.top {
    display: none;
  }

  .toggle.expanded {
    display: none;
  }

  .dropdown {
    width: 100%;
  }

  .dropdown-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 !important;
    box-shadow: none !important;
    border-top: none !important;
  }

  .search {
    align-self: center;
    width: 100% !important;
    box-sizing: border-box;
    padding: 9px 12px;
    margin-bottom: 10px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground} !important;
    border-radius: 20px;
    font-family: ${({ theme }) => theme.fonts};
  }

  .infinite-scroll-component {
    max-height: calc(60vh - 60px);
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 7px;
  }

  .react-dropdown-tree-select {
    height: 60vh;
  }
`

const TreeSelect = ({ handleTypeFilterChange, treeSelectData }) => (
  <TreeSelectContainer>
    <DropdownTreeSelect
      data={treeSelectData}
      texts={{ inlineSearchPlaceholder: 'Search for a type...' }}
      showDropdown="always"
      keepTreeOnSearch
      inlineSearchInput
      onChange={handleTypeFilterChange}
    />
  </TreeSelectContainer>
)

export default TreeSelect
