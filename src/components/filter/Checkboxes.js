import React, { useContext } from 'react'

import SearchContext from '../search/SearchContext'
import Checkbox from '../ui/Checkbox'

const Checkboxes = ({ handleCheckboxChange }) => {
  const { filters } = useContext(SearchContext)
  const { muni, invasive } = filters
  return (
    <form>
      <label htmlFor="muni" style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          id="muni"
          checked={muni}
          name="municipal"
          onChange={handleCheckboxChange}
        />
        Municipal Tree Inventories
      </label>
      <br />
      <label
        htmlFor="invasive"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Checkbox
          id="invasive"
          checked={invasive}
          name="invasive"
          onChange={handleCheckboxChange}
        />
        Invasive Species Only
      </label>
    </form>
  )
}

export default Checkboxes
