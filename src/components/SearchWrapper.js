import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypesMock } from '../utils/api'
import Filter from './filter/Filter'
import MapContext from './map/MapContext'
import Search from './search/Search'
import SearchContext from './search/SearchContext'
import { theme } from './ui/GlobalStyle'
import IconButton from './ui/IconButton'

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SearchWrapper = () => {
  const { view } = useContext(MapContext)
  const { filters, setFilters } = useContext(SearchContext)

  const [filterPressed, setFilterPressed] = useState(false)
  const [typeMapping] = useState(new Map())

  const handleTypeFilterChange = (currentNode) => {
    if (currentNode.checked) {
      setFilters({ ...filters, types: [...filters.types, currentNode.value] })
    } else {
      setFilters({
        ...filters,
        types: [filters.types.filter((typeId) => typeId !== currentNode.value)],
      })
    }
  }

  const handleCheckboxChange = (event) => {
    event.target.name === 'municipal'
      ? setFilters({ ...filters, muni: !filters.muni })
      : setFilters({ ...filters, invasive: !filters.invasive })
  }

  const handleFilterButtonClick = () => setFilterPressed(!filterPressed)

  useEffect(() => {
    const fetchTypes = async () => {
      if (view.bounds) {
        const { zoom, bounds } = view
        const query = {
          swlng: bounds.sw.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          zoom: zoom,
          muni: filters.muni,
        }
        const types = await getTypesMock(query)
        // TODO: create tree object for TreeSelect to use as data
        buildTypeMapping(types)
      }
    }

    const buildTypeMapping = (types) => {
      types.forEach((type) => {
        const typeObject = {
          label: type.name,
          value: type.id,
          expanded: true,
          children: [],
        }
        if (!type.parent_id) {
          typeMapping.set(type.id, typeObject)
        } else {
          const parentTypeObject = typeMapping.get(type.parent_id)
          parentTypeObject.children.push(typeObject)
        }
      })
    }

    fetchTypes()
  }, [view, filters, typeMapping])

  const buildTreeSelectData = () => [...typeMapping.values()]

  return (
    <div>
      <SearchBarContainer>
        <Search
          filterPressed={filterPressed}
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
              onClick={handleFilterButtonClick}
              label="filter-button"
            />
          }
        />
      </SearchBarContainer>
      {filterPressed && (
        <Filter
          handleTypeFilterChange={handleTypeFilterChange}
          handleCheckboxChange={handleCheckboxChange}
          treeSelectData={buildTreeSelectData()}
        />
      )}
    </div>
  )
}

export default SearchWrapper
