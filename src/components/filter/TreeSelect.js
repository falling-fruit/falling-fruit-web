import 'react-dropdown-tree-select/dist/styles.css'

import React from 'react'
import styled from 'styled-components/macro'

import NonrenderTreeSelect from './NonrenderTreeSelect'

/* TODO: Checkbox styling */
const TreeSelectContainer = styled.div`
  .dropdown-trigger.arrow.top {
    display: none;
  }

  .toggle.expanded {
    display: none;
  }

  .dropdown {
    height: 100%;
    width: 100%;
  }

  .dropdown-content {
    display: flex;
    flex-direction: column;
    height: 100%;
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

  // TODO: this breaks the infinite scroll of react-dropdown-tree-select
  .infinite-scroll-component {
    height: 100% !important;
    @media ${({ theme }) => theme.device.desktop} {
      max-height: calc(30vh - 60px);
    }
    @media ${({ theme }) => theme.device.mobile} {
      max-height: calc(60vh - 60px);
    }
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 7px;
  }

  .react-dropdown-tree-select {
    @media ${({ theme }) => theme.device.desktop} {
      height: 30vh;
    }
    @media ${({ theme }) => theme.device.mobile} {
      height: 60vh;
    }
  }

  label {
    display: flex;
    align-items: center;
  }

  .checkbox-item {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: 0;
  }

  .checkbox-item:before {
    cursor: pointer;
    border: 3px solid ${({ theme }) => theme.orange};
    border-radius: 4px;
    content: '';
    background: ${({ theme }) => theme.transparentOrange};
    display: flex;
    width: 15px;
    height: 15px;
  }

  .checkbox-item:checked:before {
    background: url('/checkmark/checkmark.svg');
    background-color: ${({ theme }) => theme.orange};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .checkbox-item:indeterminate:before {
    background: url('/checkmark/mixed_checkmark.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  ul {
    height: 100%;
    font-weight: 700;
  }

  ul > div {
    height: 100%;
  }
`

const TreeSelect = ({ data, onChange, ...props }) => (
  <TreeSelectContainer>
    <NonrenderTreeSelect
      data={data}
      onChange={onChange}
      texts={{ inlineSearchPlaceholder: 'Search for a type...' }}
      showDropdown="always"
      showPartiallySelected
      keepTreeOnSearch
      keepChildrenOnSearch
      inlineSearchInput
      {...props}
    />
  </TreeSelectContainer>
)

export default TreeSelect
