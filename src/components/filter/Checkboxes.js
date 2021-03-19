import React from 'react'

/* TODO: Checkbox styling */
const Checkboxes = ({ handleCheckboxChange }) => (
  <form>
    <label>
      <input name="municipal" type="checkbox" onChange={handleCheckboxChange} />
      Municipal Tree Inventories
    </label>
    <br />
    <label>
      <input name="invasive" type="checkbox" onChange={handleCheckboxChange} />
      Invasive Species Only
    </label>
  </form>
)

export default Checkboxes
