import React from 'react'

import Checkboxes from './Checkboxes'
import TreeSelect from './TreeSelect'

const Filter = ({ handleTypeFilterChange, handleCheckboxChange }) => (
  <>
    <p>Edible Type</p>
    <TreeSelect handleTypeFilterChange={handleTypeFilterChange} />
    <Checkboxes handleCheckboxChange={handleCheckboxChange} />
  </>
)

export default Filter
