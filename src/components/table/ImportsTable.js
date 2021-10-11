import { useEffect, useState } from 'react'

import { getImports } from '../../utils/api'
import DataTable from './DataTable'
import { FORMATTERS } from './DataTableProperties'

const ImportsTable = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getImportData = async () => {
      const res = await getImports()
      setData(res)
    }
    getImportData()
  }, [])

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
  ]

  return <DataTable columns={columns} data={data} />
}

export default ImportsTable
