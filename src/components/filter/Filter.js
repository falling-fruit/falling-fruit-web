import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import buildTypeSchema from '../../utils/buildTypeSchema'
import { getTypesMock } from '../../utils/getTypesMock'
import MapContext from '../map/MapContext'
import SearchContext from '../search/SearchContext'
import CheckboxFilters from './CheckboxFilters'
import TreeSelect from './TreeSelect'

const addTypes = (types, node) => {
  if (typeof node.value === 'number') {
    types.push(node.value)
  }

  for (const child of node.childrenCopy) {
    addTypes(types, child)
  }
}

const StyledFilter = styled.div`
  @media ${({ theme }) => theme.device.desktop} {
    box-shadow: 0 3px 5px ${({ theme }) => theme.shadow};
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    padding: 0 10px 16px 10px;
  }
`

const Filter = ({ isOpen }) => {
  const { view } = useContext(MapContext)
  const { filters, setFilters } = useContext(SearchContext)
  const [treeData, setTreeData] = useState([])

  const handleTreeChange = (currentNode, selectedNodes) => {
    const selectedTypes = []
    for (const node of selectedNodes) {
      addTypes(selectedTypes, node)
    }

    setFilters((prevFilters) => ({ ...prevFilters, types: selectedTypes }))
    // setFilterCount(getFilterCount(selectedNodes))
  }

  /*
  const getFilterCount = (selectedNodes) => {
    let countTotal = 0
    selectedNodes.forEach((node) => {
      const count = node.label.slice(
        node.label.indexOf('(') + 1,
        node.label.length - 1,
      )
      countTotal += parseInt(count)
    })
    return countTotal > 99 ? '99+' : countTotal.toString()
  }
  */

  useEffect(() => {
    const updateTypesTree = async () => {
      const { zoom, bounds } = view

      if (bounds) {
        const query = {
          swlng: bounds.sw.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          zoom: zoom,
          muni: filters.muni,
        }
        const types = await getTypesMock(query)
        // Keep type ids that still exist
        const typeIds = types.map((type) => type.id)
        setFilters((prevFilters) => ({
          ...prevFilters,
          types: typeIds,
        }))
        // Build the tree select data
        const treeSelectData = buildTypeSchema(types, filters.types)
        setTreeData(treeSelectData)
      }
    }

    updateTypesTree()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  return (
    isOpen && (
      <StyledFilter>
        <p>Edible Type</p>
        <TreeSelect data={treeData} onChange={handleTreeChange} />
        <CheckboxFilters values={filters} onChange={setFilters} />
      </StyledFilter>
    )
  )
}

export default Filter
