import { intersection } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypes } from '../../utils/api'
import { buildTypeSchema, getSelectedTypes } from '../../utils/buildTypeSchema'
import MapContext from '../map/MapContext'
import SearchContext from '../search/SearchContext'
import CheckboxFilters from './CheckboxFilters'
import TreeSelect from './TreeSelect'

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
    setFilters((prevFilters) => ({
      ...prevFilters,
      types: getSelectedTypes(selectedNodes),
    }))
  }

  useEffect(() => {
    const updateTypesTree = async () => {
      const { zoom, bounds } = view

      if (bounds) {
        const query = {
          swlng: bounds.sw.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          zoom: Math.min(zoom, 12),
          muni: filters.muni,
        }
        const types = await getTypes(query)

        // Keep only types that still exist in the current view
        const newTypes = types.map((type) => type.id)
        setFilters((prevFilters) => ({
          ...prevFilters,
          types:
            prevFilters.types === null
              ? newTypes
              : intersection(prevFilters.types, newTypes),
        }))

        setTreeData(buildTypeSchema(types, filters.types))
      }
    }

    if (isOpen) {
      updateTypesTree()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, isOpen])

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
