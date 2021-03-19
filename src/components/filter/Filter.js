import React, { useState } from 'react'

import Checkboxes from './Checkboxes'
import TreeSelect from './TreeSelect'

const Filter = () => {
  const [municipal, setMunicipal] = useState(false)
  const [invasive, setInvasive] = useState(false)

  const handleCheckboxChange = (event) => {
    event.target.name === 'municipal'
      ? setMunicipal(!municipal)
      : setInvasive(!invasive)
  }

  return (
    <>
      <p>Edible Type</p>
      <TreeSelect />
      <Checkboxes handleCheckboxChange={handleCheckboxChange} />
    </>
  )
}

export default Filter
