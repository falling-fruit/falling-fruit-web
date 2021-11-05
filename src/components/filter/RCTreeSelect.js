import 'rc-tree-select/assets/index.css'

import TreeSelect from 'rc-tree-select'
import { useState } from 'react'
import styled from 'styled-components/macro'

const TreeSelectContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  @media ${({ theme }) => theme.device.mobile} {
    height: 50vh;
  }

  .rc-tree-select-selection {
    display: none;
  }

  > *:nth-child(2) {
    z-index: 0;
    position: static !important;
    height: 100%;

    div:nth-child(1) {
      top: 0;
      left: 0;
      height: 100%;
    }
  }

  .rc-tree-select-dropdown {
    width: 100%;
    min-width: 0 !important;
    position: relative;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
    border-radius: 7px;
    top: 0 !important;
  }

  // TODO: Look into relative height of the ul element
  .rc-tree-select-tree {
    height: 100px;
  }

  .rc-tree-select-tree-checkbox {
    border: 3px solid ${({ theme }) => theme.orange} !important;
    border-radius: 4px !important;
    background: ${({ theme }) => theme.transparentOrange} !important;
    margin-right: 5px !important;
    width: 8px !important;
    height: 8px !important;
  }

  .rc-tree-select-tree-checkbox-checked,
  .rc-tree-select-tree-checkbox-indeterminate {
    background-repeat: no-repeat !important;
    background-position: center !important;
    background-size: contain !important;
  }

  .rc-tree-select-tree-checkbox-checked {
    background-image: url('/checkmark/checkmark.svg') !important;
    background-color: ${({ theme }) => theme.orange} !important;
  }

  .rc-tree-select-tree-checkbox-indeterminate {
    background-image: url('/checkmark/mixed_checkmark.svg') !important;
  }

  .tree-node-text {
    font-size: 0.875rem;

    .tree-node-common-name {
      font-weight: bold;
      margin-right: 5px;
      color: ${({ theme }) => theme.secondaryText};
    }

    .tree-node-scientific-name {
      font-style: italic;
      margin-right: 5px;
      color: ${({ theme }) => theme.text};
    }

    .tree-node-count {
      font-weight: bold;
      color: ${({ theme }) => theme.text};
    }
  }

  li:not(.filter-node)
    > .rc-tree-select-tree-node-content-wrapper
    > .rc-tree-select-tree-title
    > .tree-node-text
    > * {
    color: ${({ theme }) => theme.text};
  }
`

const RCTreeSelect = ({ data, onChange, checkedTypes, searchValue }) => {
  const [treeSelectContainerRef, setTreeSelectContainerRef] = useState(null)

  return (
    <TreeSelectContainer ref={setTreeSelectContainerRef}>
      {treeSelectContainerRef && (
        <TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{
            flex: 1,
            height: '100%',
            overflow: 'auto',
          }}
          treeData={data}
          treeLine
          value={checkedTypes}
          treeCheckable
          onChange={onChange}
          treeDataSimpleMode={{
            id: 'value',
            rootPId: 'null',
          }}
          treeNodeFilterProp="searchValue"
          open
          searchValue={searchValue}
          virtual
          getPopupContainer={() => treeSelectContainerRef}
        />
      )}
    </TreeSelectContainer>
  )
}

export default RCTreeSelect
