import intersection from 'ramda/src/intersection'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { getTypes } from '../../utils/api'
import { buildTypeSchema, getSelectedTypes } from '../../utils/buildTypeSchema'
import CheckboxFilters from './CheckboxFilters'
import TreeSelect from './TreeSelect'

const StyledFilter = styled.div`
  @media ${({ theme }) => theme.device.desktop} {
    box-shadow: 0 3px 5px ${({ theme }) => theme.shadow};
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    padding: 0 10px 16px 10px;
  }

  @media ${({ theme }) => theme.device.mobile} {
    display: flex;
    flex-direction: column-reverse;
  }

  .edible-type-text {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.secondaryText};
    margin-top: 18px;
    margin-bottom: 7px;
  }
`

const Filter = ({ isOpen }) => {
  const { view } = useMap()
  const { filters, setFilters } = useSearch()
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
        const typeIds = types.map((type) => type.id)

        setFilters((prevFilters) => {
          // Keep only types that still exist in the current view
          const newTypes =
            prevFilters.types === null
              ? typeIds
              : intersection(prevFilters.types, typeIds)

          setTreeData(buildTypeSchema(types, newTypes))

          return {
            ...prevFilters,
            types: newTypes,
          }
        })
      }
    }

    if (isOpen) {
      updateTypesTree()
    }
  }, [view, isOpen, filters.muni, setFilters])

  return (
    isOpen && (
      <StyledFilter>
        <div>
          <p className="edible-type-text">Edible Type</p>
          <TreeSelect data={treeData} onChange={handleTreeChange} />
        </div>
        <div>
          <CheckboxFilters values={filters} onChange={setFilters} />
        </div>
      </StyledFilter>
    )
  )
}

export default Filter
