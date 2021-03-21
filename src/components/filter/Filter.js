import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypesMock } from '../../utils/api'
import {
  buildTreeSelectData,
  getTypeObjectFromId,
  updateCheckedForAllChildren,
} from '../../utils/typeTree'
import MapContext from '../map/MapContext'
import SearchContext from '../search/SearchContext'
import Checkboxes from './Checkboxes'
import TreeSelect from './TreeSelect'

const FilterWrapper = styled.div`
  ${({ isDesktop, theme }) =>
    isDesktop &&
    `
      box-shadow: 0 3px 5px ${theme.shadow};
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
      padding: 0 10px 16px 10px;
  `};
`

const Filter = ({ isDesktop }) => {
  const { view } = useContext(MapContext)
  const { filters, setFilters } = useContext(SearchContext)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  return (
    <FilterWrapper isDesktop={isDesktop}>
      <p>Edible Type</p>
      <TreeSelect
        handleTypeFilterChange={handleTypeFilterChange}
        treeSelectData={treeSelectData}
      />
      <Checkboxes handleCheckboxChange={handleCheckboxChange} />
    </FilterWrapper>
  )
}

export default Filter
