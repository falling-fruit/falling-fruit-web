import { Search as SearchIcon } from '@styled-icons/boxicons-regular'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { getImports } from '../../utils/api'
import Input from '../ui/Input'
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
    id: 'link',
    name: 'Dataset Link',
    selector: (row) => row.link,
    format: FORMATTERS.link,
  },
]
// /about/dataset/:datasetID
const ImportsTable = () => {
  const [data, setData] = useState([])
  const [filterText, setFilterText] = React.useState('')
  const history = useHistory()
  useEffect(() => {
    const getImportData = async () => {
      const res = await getImports()
      setData(res)
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

  const onRowClicked = (row) => {
    history.push({
      pathname: `/about/dataset/${row.id}`,
    })
  }
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
      onRowClicked={onRowClicked}
    />
  )
}

const FilterComponent = ({ filterText, onFilter }) => (
  <>
    <Input
      placeholder="Search for a dataset"
      icon={<SearchIcon />}
      value={filterText}
      onChange={onFilter}
    />
  </>
)

export default ImportsTable
