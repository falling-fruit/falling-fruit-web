import React, { useContext } from 'react'
import styled from 'styled-components/macro'

import SearchContext from '../search/SearchContext'
import Checkbox from '../ui/Checkbox'

const StyledLabel = styled.label`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

const Checkboxes = ({ handleCheckboxChange }) => {
  const { filters } = useContext(SearchContext)
  const { muni, invasive } = filters
  return (
    <form>
      <StyledLabel htmlFor="muni">
        <Checkbox
          id="muni"
          checked={muni}
          name="municipal"
          onChange={handleCheckboxChange}
        />
        Municipal Tree Inventories
      </StyledLabel>
      <StyledLabel htmlFor="invasive">
        <Checkbox
          id="invasive"
          checked={invasive}
          name="invasive"
          onChange={handleCheckboxChange}
        />
        Invasive Species Only
      </StyledLabel>
    </form>
  )
}

export default Checkboxes
