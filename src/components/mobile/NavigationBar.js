import React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import Filter from '../filter/Filter'
import Search from '../search/Search'
import Share from '../share/Share'
import TopBar from '../ui/TopBar'

const StyledOverlay = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column-reverse;
  ${({ isOpen }) =>
    !isOpen &&
    css`
      display: none;
    `}
`

const NavigationBar = () => {
  const filterOpen = useSelector((state) => state.filter.isOpenInMobileLayout)
  const shareOpen = useSelector((state) => state.share.isOpenInMobileLayout)

  return (
    <TopBar>
      <Search />
      <StyledOverlay isOpen={filterOpen}>
        <Filter />
      </StyledOverlay>
      <StyledOverlay isOpen={shareOpen}>
        <Share />
      </StyledOverlay>
    </TopBar>
  )
}

export default NavigationBar
