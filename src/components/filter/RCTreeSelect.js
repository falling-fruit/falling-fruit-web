import 'rc-tree-select/assets/index.css'

import TreeSelect, { SHOW_PARENT } from 'rc-tree-select'
import { useState } from 'react'

const RCTreeSelect = ({ data, onChange }) => {
  const [value, setValue] = useState([])
  const defaultValue = data.map((t) => t.value)

  return (
    <TreeSelect
      style={{ width: 300 }}
      dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
      treeData={data}
      treeLine
      value={value.length === 0 ? defaultValue : value}
      defaultValue={defaultValue}
      treeCheckable
      showCheckedStrategy={SHOW_PARENT}
      onChange={(selectedTypes) => {
        setValue(selectedTypes)
        onChange(selectedTypes)
      }}
      treeDataSimpleMode={{
        id: 'key',
        rootPId: 'null',
      }}
      maxTagCount={0}
      maxTagPlaceholder={null}
      treeNodeFilterProp="title"
      open
      defaultOpen
      showSearch
    />
  )
}

export default RCTreeSelect
