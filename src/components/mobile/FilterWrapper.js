import React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import Filter from '../filter/Filter'

const StyledFilter = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column-reverse;
  ${({ isOpen }) =>
    !isOpen &&
    css`
      display: none;
    `}
`

const FilterWrapper = () => {
  const filterOpen = useSelector((state) => state.filter.isOpenInMobileLayout)
  const { typesAccess } = useSelector((state) => state.type)

  if (typesAccess.isEmpty) {
    return null
  }

  return (
    <StyledFilter isOpen={filterOpen}>
      <Filter />
    </StyledFilter>
  )
}

export default FilterWrapper
