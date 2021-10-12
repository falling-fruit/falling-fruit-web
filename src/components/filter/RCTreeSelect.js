import 'rc-tree-select/assets/index.css'

import TreeSelect, { SHOW_PARENT } from 'rc-tree-select'
import { useState } from 'react'
import styled from 'styled-components/macro'

import Input from '../ui/Input'

const TreeSelectContainer = styled.div`
  .rc-tree-select-selection {
    display: none;
  }
`

const RCTreeSelect = ({ data, onChange, checkedTypes }) => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <TreeSelectContainer>
      <Input onChange={(e) => setSearchValue(e.target.value)} />
      <TreeSelect
        style={{ width: 300 }}
        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
        treeData={data}
        treeLine
        value={checkedTypes}
        treeCheckable
        showCheckedStrategy={SHOW_PARENT}
        onChange={onChange}
        treeDataSimpleMode={{
          id: 'key',
          rootPId: 'null',
        }}
        maxTagCount={0}
        maxTagPlaceholder={null}
        treeNodeFilterProp="title"
        open
        searchValue={searchValue}
        virtual
      />
    </TreeSelectContainer>
  )
}

export default RCTreeSelect
