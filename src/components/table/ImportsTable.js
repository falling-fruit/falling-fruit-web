import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getImports } from '../../utils/api'
import DataTable from './DataTable'
import { FORMATTERS } from './DataTableProperties'

const columns = [
  {
    id: 'type',
    name: 'Type',
    selector: (row) => (row.muni ? 'Tree inventory' : 'Community map'),
    sortable: true,
  },
  {
    id: 'name',
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    format: FORMATTERS.name,
  },
  {
    name: 'Locations',
    selector: (row) => row.location_count,
    sortable: true,
  },
  {
    id: 'created_at',
    name: 'Date Imported',
    selector: (row) => row.created_at,
    sortable: true,
    format: FORMATTERS.created_at,
  },
  {
    id: 'dataset_link',
    name: 'Dataset Link',
    selector: (row) => row.link,
  },
]
const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  font-family: Lato;
  &:hover {
    cursor: pointer;
  }
`
const ImportsTable = () => {
  const [data, setData] = useState([])
  const [filterText, setFilterText] = React.useState('')
  useEffect(() => {
    const getImportData = async () => {
      const res = await getImports()
      setData(res)
      console.log(res)
    }
    getImportData()
  }, [])
  const filteredItems = data.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.muni && 'tree inventory'.includes(filterText.toLowerCase())) ||
      (!item.muni && 'community map'.includes(filterText.toLowerCase())) ||
      item.created_at.includes(filterText),
  )

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setFilterText('')
      }
    }

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    )
  }, [filterText])
  return (
    <DataTable
      columns={columns}
      data={filteredItems}
      pagination
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      persistTableHead
    />
  )
}

const FilterComponent = ({ filterText, onFilter }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search for a dataset"
      value={filterText}
      onChange={onFilter}
    />
  </>
)

export default ImportsTable
