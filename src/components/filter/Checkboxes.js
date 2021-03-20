import React, { useContext } from 'react'

import SearchContext from '../search/SearchContext'

/* TODO: Checkbox styling */
const Checkboxes = ({ handleCheckboxChange }) => {
  const { filters } = useContext(SearchContext)
  const { muni, invasive } = filters
  return (
    <form>
      <label>
        <input
          checked={muni}
          name="municipal"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
        Municipal Tree Inventories
      </label>
      <br />
      <label>
        <input
          checked={invasive}
          name="invasive"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
        Invasive Species Only
      </label>
    </form>
  )
}

export default Checkboxes
