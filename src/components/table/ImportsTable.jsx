import { Search as SearchIcon } from '@styled-icons/boxicons-regular'
import React, { useEffect, useState } from 'react'

import { getImports } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import Input from '../ui/Input'
import DataTable from './DataTable'
import { FORMATTERS } from './DataTableProperties'

const columns = [
  {
    id: 'type',
    name: 'Type',
    selector: (row) => row.muni,
    sortable: true,
    format: FORMATTERS.muni,
    minWidth: '10em',
  },
  {
    id: 'name',
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    wrap: true,
    grow: 3,
  },
  {
    name: 'Locations',
    selector: (row) => row.location_count,
    sortable: true,
    right: true,
  },
  {
    id: 'created_at',
    name: 'Imported',
    selector: (row) => row.created_at,
    sortable: true,
    format: FORMATTERS.created_at,
    center: true,
    minWidth: '8em',
  },
  {
    id: 'link',
    name: 'Link',
    selector: (row) => row.link,
    format: FORMATTERS.link,
    center: true,
    compact: true,
    width: '50px',
  },
]

const ImportsTable = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterText, setFilterText] = React.useState('')
  const history = useAppHistory()

  useEffect(() => {
    const getImportData = async () => {
      setIsLoading(true)
      setData(await getImports())
      setIsLoading(false)
    }
    getImportData()
  }, [])

  const filteredData = data.filter((item) => {
    const query = filterText.toLowerCase()
    const keywords = [
      item.name,
      FORMATTERS.muni(item),
      FORMATTERS.created_at(item),
    ]
    return keywords.some((keyword) => keyword.toLowerCase().includes(query))
  })

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      defaultSortFieldId={'created_at'}
      defaultSortAsc={false}
      progressPending={isLoading}
      subHeader
      subHeaderComponent={
        <Input
          placeholder="Search"
          icon={<SearchIcon />}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          onClear={() => setFilterText('')}
        />
      }
      persistTableHead
      onRowClicked={(row) => {
        history.push(`/imports/${row.id}`)
      }}
    />
  )
}

export default ImportsTable
