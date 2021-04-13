import 'react-dropdown-tree-select/dist/styles.css'

import React from 'react'
import styled from 'styled-components/macro'

import NonrenderTreeSelect from './NonrenderTreeSelect'

const TreeSelectContainer = styled.div`
  .toggle.expanded {
    display: none;
  }

  .dropdown-trigger.arrow.top,
  .dropdown-trigger.arrow.bottom {
    ${({ popover }) => !popover && `display: none`};
    border-radius: 23px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};

    ::after {
      display: none;
    }
  }

  .tag-item {
    .tag {
      background-color: ${({ theme }) => theme.transparentOrange};
      border-color: ${({ theme }) => theme.transparentOrange};
      color: ${({ theme }) => theme.orange};
      border-radius: 20px;
      padding: 0px 10px 0px 10px;
      font-size: 12px;

      .tag-remove {
        display: none;
      }
    }

    .placeholder {
      color: ${({ theme }) => theme.text};
      font-weight: 400;
    }
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
    max-height: calc(30vh - 60px);
    @media ${({ theme }) => theme.device.mobile} {
      max-height: calc(60vh - 60px);
    }
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 7px;
  }

  .react-dropdown-tree-select {
    height: 30vh;
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

const TreeSelect = ({ data, onChange, popover, ...props }) => (
  <TreeSelectContainer popover={popover}>
    <NonrenderTreeSelect
      data={data}
      onChange={onChange}
      texts={{
        placeholder: 'Select a type...',
        inlineSearchPlaceholder: 'Search for a type...',
      }}
      showDropdown={popover ? undefined : 'always'}
      showPartiallySelected
      keepTreeOnSearch
      keepChildrenOnSearch
      inlineSearchInput
      {...props}
    />
  </TreeSelectContainer>
)

export default TreeSelect
