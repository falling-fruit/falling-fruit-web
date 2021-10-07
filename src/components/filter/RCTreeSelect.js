import './rc-tree.css'
import './rc-select.css'

import TreeSelect from 'rc-tree-select'
import styled from 'styled-components/macro'

const TreeSelectContainer = styled.div`
  .rc-tree-select {
    width: 100%;
  }
  .rc-tree-select-selector {
    border-radius: 23px;
    border: 1px solid ${({ theme }) => theme.secondaryBackground};
  }
`

const RCTreeSelect = ({ data, onChange }) => (
  <TreeSelectContainer className="rc-tree-select-open">
    <TreeSelect
      onChange={onChange}
      treeData={data}
      placeholder={<span>Search for a type...</span>}
      dropdownStyle={{
        maxHeight: 200,
        overflow: 'auto',
        zIndex: 1,
      }}
      showSearch
      treeCheckable
      showTreeIcon={false}
      treeDefaultExpandAll
      treeNodeFilterProp="title"
    />
  </TreeSelectContainer>
)

export default RCTreeSelect
