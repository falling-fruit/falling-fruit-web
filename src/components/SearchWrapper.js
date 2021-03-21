import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { useIsDesktop } from '../utils/useBreakpoint'
import Filter from './filter/Filter'
import Search from './search/Search'
import { theme } from './ui/GlobalStyle'
import IconButton from './ui/IconButton'

// TODO: change most isDesktop usages to media queries with theme.device
const StyledSearchWrapper = styled.div`
  ${({ isDesktop }) => isDesktop && `padding: 10px`}
`

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SearchWrapper = () => {
  const [filterPressed, setFilterPressed] = useState(false)
  const isDesktop = useIsDesktop()

  return (
    <StyledSearchWrapper isDesktop={isDesktop}>
      <SearchBarContainer>
        <Search
          filterPressed={filterPressed}
          setFilterPressed={setFilterPressed}
          filterButton={
            <IconButton
              size={45}
              raised={false}
              pressed={filterPressed}
              icon={
                <FilterIcon
                  color={filterPressed ? theme.orange : theme.secondaryText}
                />
              }
              onClick={() =>
                setFilterPressed((filterPressed) => !filterPressed)
              }
              label="filter-button"
            />
          }
        />
      </SearchBarContainer>
      {filterPressed && <Filter />}
    </StyledSearchWrapper>
  )
}

export default SearchWrapper
