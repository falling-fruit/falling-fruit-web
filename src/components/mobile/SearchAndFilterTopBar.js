import React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import Filter from '../filter/Filter'
import Search from '../search/Search'
import TopBar from '../ui/TopBar'

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

const SearchAndFilterTopBar = () => {
  const filterOpen = useSelector((state) => state.filter.isOpenInMobileLayout)
  const { typesAccess } = useSelector((state) => state.type)

  if (typesAccess.isEmpty) {
    return null
  }

  return (
    <TopBar>
      <Search />
      <StyledFilter isOpen={filterOpen}>
        <Filter />
      </StyledFilter>
    </TopBar>
  )
}

export default SearchAndFilterTopBar
