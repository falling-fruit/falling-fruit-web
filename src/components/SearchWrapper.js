import { FilterAlt as FilterIcon } from '@styled-icons/boxicons-solid'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getTypes } from '../utils/api'
import Filter from './filter/Filter'
import MapContext from './map/MapContext'
import Search from './search/Search'
import { theme } from './ui/GlobalStyle'
import IconButton from './ui/IconButton'

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SearchWrapper = () => {
  const { view } = useContext(MapContext)

  const [filterPressed, setFilterPressed] = useState(false)
  const [municipal, setMunicipal] = useState(false)
  const [invasive, setInvasive] = useState(false)
  const [typeMapping] = useState(new Map())

  const handleTypeFilterChange = (currentNode, selectedNodes) => {
    console.log('Current node: ', currentNode)
    console.log('Selected nodes: ', selectedNodes)
  }

  const handleCheckboxChange = (event) => {
    event.target.name === 'municipal'
      ? setMunicipal(!municipal)
      : setInvasive(!invasive)
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
          muni: municipal,
        }
        const types = await getTypes(query)
        // TODO: create tree object for TreeSelect to use as data
        buildTypeMapping(types)
      }
    }

    const buildTypeMapping = (types) => {
      types.forEach((type) => {
        const typeObject = {
          label: type.scientific_name,
          value: type.id,
          children: [],
        }
        if (!type.parent_id) {
          typeMapping.set(type.parent_id, typeObject)
        } else {
          const parentTypeObject = typeMapping.get(type.parent_id)
          parentTypeObject.children.push(typeObject)
        }
      })
    }

    fetchTypes()
  }, [view, municipal, typeMapping])

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
        />
      )}
    </div>
  )
}

export default SearchWrapper
