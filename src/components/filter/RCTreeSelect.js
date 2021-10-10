import './rc-tree.css'
import './rc-select.css'

import TreeSelect from 'rc-tree-select'
import { useState } from 'react'
import styled from 'styled-components/macro'

const TreeSelectContainer = styled.div`
  .rc-tree-select {
    width: 100%;
    height: 300px;
  }
  .rc-tree-select-selector {
    border-radius: 23px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
  }
`

const RCTreeSelect = ({ data, checkedTypes }) => {
  const [value, setValue] = useState(data.map((t) => t.value))

  return (
    <TreeSelectContainer>
      <TreeSelect
        onChange={setValue}
        treeData={data}
        placeholder={<span>Search for a type...</span>}
        dropdownStyle={{
          height: 250,
          width: 290,
          overflow: 'auto',
          borderRadius: 7,
          border: '1px solid #e0e1e2',
          zIndex: 1,
        }}
        dropdownMatchSelectWidth={false} // Allows for overflow-x
        treeCheckable
        showTreeIcon={false}
        treeNodeFilterProp="title" // Search the tree based on node titles instead of values
        defaultOpen
        // defaultValue={
        //   checkedTypes.length === 0 ? data.map((t) => t.value) : checkedTypes
        // }
        value={value}
        tagRender={() => null} // Prevent selected tags from showing
        virtual
        treeDataSimpleMode={{
          id: 'key',
          rootPId: 'null',
        }}
      />
    </TreeSelectContainer>
  )
}

export default RCTreeSelect
