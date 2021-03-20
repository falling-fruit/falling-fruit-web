import React from 'react'

import Checkboxes from './Checkboxes'
import TreeSelect from './TreeSelect'

const Filter = ({
  handleTypeFilterChange,
  handleCheckboxChange,
  treeSelectData,
}) => (
  <>
    <p>Edible Type</p>
    <TreeSelect
      handleTypeFilterChange={handleTypeFilterChange}
      treeSelectData={treeSelectData}
    />
    <Checkboxes handleCheckboxChange={handleCheckboxChange} />
  </>
)

export default Filter
