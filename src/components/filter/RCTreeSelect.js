import 'rc-tree-select/assets/index.css'

import TreeSelect from 'rc-tree-select'
import { useState } from 'react'
import styled from 'styled-components/macro'

import Input from '../ui/Input'

const TreeSelectContainer = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
    height: 60vh;
  }
  display: flex;
  flex-direction: column;
  flex: 15;

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
    height: 100px;
  }
`

const StyledInput = styled(Input)`
  height: 36px;
  margin-bottom: 10px;
  padding: 9px 12px;
  input {
    height: 100%;
  }
`

const RCTreeSelect = ({ data, onChange, checkedTypes }) => {
  const [searchValue, setSearchValue] = useState('')
  const [treeSelectContainerRef, setTreeSelectContainerRef] = useState(null)

  return (
    <TreeSelectContainer ref={setTreeSelectContainerRef}>
      <StyledInput
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
          value={checkedTypes}
          treeCheckable
          onChange={onChange}
          treeDataSimpleMode={{
            id: 'value',
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
