import React from 'react'

import Checkboxes from './Checkboxes'
import TreeSelect from './TreeSelect'

const Filter = ({
  handleTypeFilterChange,
  handleCheckboxChange,
  treeSelectData,
  isDesktop,
}) => (
  <>
    <p>Edible Type</p>
    <TreeSelect
      handleTypeFilterChange={handleTypeFilterChange}
      treeSelectData={treeSelectData}
      isDesktop={isDesktop}
    />
    <Checkboxes handleCheckboxChange={handleCheckboxChange} />
  </>
)

export default Filter
