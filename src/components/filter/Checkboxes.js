import React, { useContext } from 'react'

import SearchContext from '../search/SearchContext'
import Checkbox from '../ui/Checkbox'

/* TODO: Checkbox styling */
const Checkboxes = ({ handleCheckboxChange }) => {
  const { filters } = useContext(SearchContext)
  const { muni, invasive } = filters
  return (
    <form>
      <label htmlFor="muni">
        <Checkbox
          id="muni"
          checked={muni}
          name="municipal"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
        Municipal Tree Inventories
      </label>
      <br />
      <label htmlFor="invasive">
        <Checkbox
          id="invasive"
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
