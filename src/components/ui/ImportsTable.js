// import wrapper call
import { useEffect, useState } from 'react'

import { getImports } from '../../utils/api'
import DataTable from './DataTable'

const ImportsTable = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    async function getImportData() {
      const res = await getImports()
      setData(res)
    }
    getImportData()
  }, [])

  const columns = [
    {
      id: 'type',
      name: 'Type',
      selector: (row) => (row.muni ? 'Tree inventory' : 'Community Map'),
      sortable: true,
    },
    {
      id: 'name',
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
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
    },
  ]

  return <DataTable columns={columns} data={data} />
}

export default ImportsTable
