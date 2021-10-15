import 'rc-tree-select/assets/index.css'

import TreeSelect from 'rc-tree-select'
import { useState } from 'react'
import styled from 'styled-components/macro'

import Input from '../ui/Input'

const TreeSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .rc-tree-select-selection {
    display: none;
  }

  > *:nth-child(3) {
    position: static !important;
    display: flex;
    flex-direction: column;
    flex: 1;
    z-index: 0;

    div:nth-child(1) {
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 5px;
    }
  }

  .rc-tree-select-dropdown {
    width: 100%;
    min-width: 0 !important;
    position: relative;
  }

  // TODO: Look into relative height of the ul element
  .rc-tree-select-tree {
    height: 0px;
  }
`

const RCTreeSelect = ({ data, onChange, checkedTypes }) => {
  const [searchValue, setSearchValue] = useState('')
  const [treeSelectContainerRef, setTreeSelectContainerRef] = useState(null)

  return (
    <TreeSelectContainer ref={setTreeSelectContainerRef}>
      <Input
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search for a type..."
      />
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
          value={checkedTypes.length === 0 ? data : checkedTypes}
          treeCheckable
          treeCheckStrictly
          onChange={onChange}
          treeDataSimpleMode={{
            id: 'key',
            rootPId: 'null',
          }}
          treeNodeFilterProp="title"
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
