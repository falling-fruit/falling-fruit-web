import 'react-dropdown-tree-select/dist/styles.css'

import React from 'react'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import styled from 'styled-components/macro'

const data = [
  {
    label: 'Acacia',
    value: 'Acacia',
    expanded: true,
    children: [
      {
        label: 'Mulga acacia',
        value: 'Mulga acacia',
      },
      {
        label: 'Swamp wattle',
        value: 'Swamp wattle',
      },
      {
        label: 'Cooba',
        value: 'Cooba',
      },
      {
        label: 'Coojong',
        value: 'Coojong',
      },
      {
        label: 'Shoestring acacia',
        value: 'Shoestring acacia',
      },
    ],
  },
  {
    label: 'Maple',
    value: 'Maple',
    expanded: true,
    children: [
      {
        label: 'Vine maple',
        value: 'Vine maple',
      },
      {
        label: 'Rocky mountain maple',
        value: 'Rocky mountain maple',
      },
    ],
  },
]

const texts = {
  inlineSearchPlaceholder: 'Search for a type...',
}

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
  }

  .search {
    align-self: center;
    width: 100% !important;
    box-sizing: border-box;
    padding: 9px 12px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground} !important;
    border-radius: 20px;
  }

  .infinite-scroll-component {
    max-height: 120px;
  }

  .react-dropdown-tree-select {
    background-color: red;
    height: 170px;
    padding-top: 12px;
  }
`

const TreeSelect = () => (
  <TreeSelectContainer>
    <DropdownTreeSelect
      data={data}
      texts={texts}
      showDropdown="always"
      keepTreeOnSearch
      inlineSearchInput
    />
  </TreeSelectContainer>
)

export default TreeSelect
