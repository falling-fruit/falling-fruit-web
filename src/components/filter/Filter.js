import React from 'react'

import Checkboxes from './Checkboxes'
import TreeSelect from './TreeSelect'

const Filter = ({ handleCheckboxChange }) => (
  <>
    <p>Edible Type</p>
    <TreeSelect />
    <Checkboxes handleCheckboxChange={handleCheckboxChange} />
  </>
)

export default Filter
