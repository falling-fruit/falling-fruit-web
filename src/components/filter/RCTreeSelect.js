import 'rc-tree-select/assets/index.css'

import TreeSelect from 'rc-tree-select'
import { useState } from 'react'
import styled from 'styled-components/macro'

import { sortTypes } from '../../utils/buildTypeSchema'
import { ReactComponent as ArrowIcon } from './arrow.svg'

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
    border-radius: 0.375em;
    top: 0 !important;
  }

  .rc-tree-select-tree {
    height: 100px;
  }

  .rc-tree-select-tree-checkbox {
    border: 2px solid ${({ theme }) => theme.orange} !important;
    border-radius: 0.225em !important;
    background: ${({ theme }) => theme.transparentOrange} !important;
    margin-right: 5px !important;
    width: 9px !important;
    height: 9px !important;
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

  li:not(.filter-node)
    > .rc-tree-select-tree-node-content-wrapper
    > .rc-tree-select-tree-title
    > .tree-node-text
    > .tree-node-common-name {
    color: ${({ theme, isSearching }) =>
      isSearching ? theme.text : theme.secondaryText};
  }

  .tree-node-text {
    font-size: 0.875rem;

    .tree-node-common-name {
      font-weight: bold;
      margin-right: 5px;
      color: ${({ theme }) => theme.secondaryText};
    }

    .tree-node-scientific-name,
    .tree-node-count {
      color: ${({ theme }) => theme.text};
    }

    .tree-node-scientific-name {
      font-style: italic;
      margin-right: 5px;
    }

    .tree-node-count {
      font-weight: bold;
    }
  }

  .rc-tree-select-tree-switcher {
    background-image: none !important;
    margin-right: 0 !important;
  }
`

const RCTreeSelect = ({ data, onChange, checkedTypes, searchValue }) => {
  // useState is necessary instead of useRef in order to restore the container ref whenever the tree re-renders
  const [treeSelectContainerRef, setTreeSelectContainerRef] = useState(null)

  const switcherIcon = (obj) =>
    !obj.isLeaf && (
      <ArrowIcon
        style={{
          backgroundColor: 'white',
          width: '1em',
          height: '0.875em',
          verticalAlign: '-.05em',
          transform: `rotate(${obj.expanded ? 90 : 0}deg)`,
        }}
      />
    )

  return (
    <TreeSelectContainer
      ref={setTreeSelectContainerRef}
      isSearching={searchValue !== ''}
    >
      {treeSelectContainerRef && (
        <TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{
            flex: 1,
            height: '100%',
            overflow: 'auto',
          }}
          treeData={sortTypes(data)}
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
          switcherIcon={switcherIcon}
        />
      )}
    </TreeSelectContainer>
  )
}

export default RCTreeSelect
