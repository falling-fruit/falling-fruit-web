import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypesMock } from '../utils/api'
import {
  buildTreeSelectData,
  getTypeObjectFromId,
  updateCheckedForAllChildren,
} from '../utils/typeTree'
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
  const [treeSelectData, setTreeSelectData] = useState([])

  /**
   * Helper function to add or remove a given type ID from an array of type Ids
   * @param {number[]} types - The current type IDs to filter on
   * @param {number} id - The selected type ID to add or remove from types
   * @param {boolean} checked - Whether the type ID should be added or removed
   */
  const updateTypes = (types, id, checked) => {
    const index = types.indexOf(id)
    if (checked && index === -1) {
      types.push(id)
    } else if (!checked) {
      types.splice(index, 1)
    }
  }

  const handleTypeFilterChange = (currentNode) => {
    const currentId = currentNode.value
    let types = [...filters.types]
    let currentTypeObject = null
    for (const root of treeSelectData) {
      currentTypeObject = getTypeObjectFromId(root, currentId)
      if (currentTypeObject) {
        break
      }
    }

    updateCheckedForAllChildren(currentTypeObject, currentNode.checked)

    if (currentTypeObject.children.length !== 0) {
      currentTypeObject.children.forEach((child) => {
        const childId = child.value
        updateTypes(types, childId, currentNode.checked)
      })
    } else {
      updateTypes(types, currentId, currentNode.checked)
    }

    setFilters((prevFilters) => ({ ...prevFilters, types }))
  }

  const handleCheckboxChange = (event) => {
    event.target.name === 'municipal'
      ? setFilters((prevFilters) => ({
          ...prevFilters,
          muni: !prevFilters.muni,
        }))
      : setFilters((prevFilters) => ({
          ...prevFilters,
          invasive: !prevFilters.invasive,
        }))
  }

  const handleFilterButtonClick = () => setFilterPressed(!filterPressed)

  useEffect(() => {
    const fetchTypesAndBuildTreeSelectData = async () => {
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
        // Set initial filter type IDs to all returned types
        const typeIds = []
        types.forEach((type) => typeIds.push(type.id))
        setFilters((prevFilters) => ({
          ...prevFilters,
          types: typeIds,
        }))
        // Build the tree select data
        const treeSelectData = buildTreeSelectData(types, filters)
        setTreeSelectData(treeSelectData)
      }
    }

    fetchTypesAndBuildTreeSelectData()
  }, [view])

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
          treeSelectData={treeSelectData}
        />
      )}
    </div>
  )
}

export default SearchWrapper
