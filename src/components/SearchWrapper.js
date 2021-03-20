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

  /**
   * Recursive helper function to get the type object given a type ID
   * @param {number} targetId - The type ID to find
   * @returns {Object} The type mapping object for the given type ID
   */
  const getTypeObjectFromId = (currentNode, targetId) => {
    if (currentNode.value === targetId) {
      return currentNode
    }

    for (const child of currentNode.children) {
      const res = getTypeObjectFromId(child, targetId)
      if (res) {
        return res
      }
    }
  }

  /**
   * Recursive helper function to update the 'checked' field of a type object and all of its children
   * @param {Object} currentTypeObject - The current type object to update
   * @param {boolean} checked - Whether the current node and its children should be checked
   */
  // const updateCheckedForAllChildren = (currentTypeObject, checked) => {
  //   currentTypeObject.checked = checked
  //   for (const child of currentTypeObject.children) {
  //     updateCheckedForAllChildren(child, checked)
  //   }
  // }

  const handleTypeFilterChange = (currentNode) => {
    const currentId = currentNode.value
    let types = filters.types

    let currentTypeObject = typeMapping.get(currentId)
    let isRoot = true
    if (!currentTypeObject) {
      isRoot = false
      for (const root of typeMapping.values()) {
        currentTypeObject = getTypeObjectFromId(root, currentId)
        if (currentTypeObject) {
          break
        }
      }
    }

    if (isRoot) {
      currentTypeObject.children.forEach((child) => {
        const childId = child.value
        updateTypes(types, childId, currentNode.checked)
      })
    } else {
      updateTypes(types, currentId, currentNode.checked)
    }

    // TODO: Figure out why setting the context is messing with checked
    // Issue: checking parent node does not check all children nodes
    console.log('TYPES: ', types)
    setFilters({ ...filters, types })
  }

  const handleCheckboxChange = (event) => {
    event.target.name === 'municipal'
      ? setFilters({ ...filters, muni: (filters.muni + 1) % 2 })
      : setFilters({ ...filters, invasive: (filters.invasive + 1) % 2 })
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
        buildTypeMapping(types)
      }
    }

    const buildTypeMapping = (types) => {
      types.forEach((type) => {
        const typeObject = {
          label: type.name,
          value: type.id,
          expanded: true,
          checked: filters.types.indexOf(type.id) !== -1,
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
