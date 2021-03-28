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

  ul {
    height: 100%;
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
      inlineSearchInput
      {...props}
    />
  </TreeSelectContainer>
)

export default TreeSelect
