import 'rc-tree-select/assets/index.css'

import TreeSelect, { SHOW_PARENT } from 'rc-tree-select'
import { useRef, useState } from 'react'
import styled from 'styled-components/macro'

import Input from '../ui/Input'

const TreeSelectContainer = styled.div`
  .rc-tree-select-selection {
    display: none;
  }
  > *:nth-child(3) {
    position: static !important;
    display: flex;
    flex-direction: column;
    div:nth-child(1) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  .rc-tree-select-dropdown {
    //
    width: 100%;
    min-width: 0px;
    max-height: 1000px;
    right: 10px;
    ////display: flex;
    //flex-direction: column;
    flex: 3;
    position: relative;
  }
  /* div:nth-child(1) {
    flex: 1;
    display: flex;
    flex-direction: column;
  } */
  /*:nth-child(3) {
    background-color: red;
  }*/
  //height: max-content;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const RCTreeSelect = ({ data, onChange, checkedTypes }) => {
  const [searchValue, setSearchValue] = useState('')
  const treeSelectContainerRef = useRef(null)

  return (
    <TreeSelectContainer ref={treeSelectContainerRef}>
      <Input onChange={(e) => setSearchValue(e.target.value)} />
      {treeSelectContainerRef.current && (
        <TreeSelect
          style={{ width: 300 }}
          dropdownStyle={{
            flex: 1,
            height: '100%',
            maxHeight: 200,
            overflow: 'auto',
          }}
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
          getPopupContainer={() => treeSelectContainerRef.current}
        />
      )}
    </TreeSelectContainer>
  )
}

export default RCTreeSelect
