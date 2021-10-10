import './rc-tree.css'
import './rc-select.css'

import TreeSelect, { SHOW_PARENT } from 'rc-tree-select'
import { useState } from 'react'

import { data } from './data'

const RCTreeSelect = () => {
  const [value, setValue] = useState(data.map((t) => t.value))

  return (
    <div className="custom-icon-demo">
      <h2>Single</h2>
      <TreeSelect
        style={{ width: 300 }}
        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
        treeData={data}
        treeLine
        value={value}
        treeCheckable
        showCheckedStrategy={SHOW_PARENT}
        onChange={setValue}
        treeDataSimpleMode={{
          id: 'key',
          rootPId: 'null',
        }}
        maxTagCount={0}
        maxTagPlaceholder={null}
        treeNodeFilterProp="title"
      />
    </div>
  )
}

export default RCTreeSelect
