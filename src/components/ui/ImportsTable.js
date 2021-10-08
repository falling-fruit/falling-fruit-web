// import wrapper call
import { useEffect, useState } from 'react'

import { getImports } from '../../utils/api'
import DataTableComponent from './DataTable'

const ImportsTable = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    console.log('hit')
    async function getImportData() {
      let res = await getImports()
      console.log(res)
      setData(res)
    }
    getImportData()
  }, [])

  const columns = [
    // TODO: missing type response
    {
      id: 'type',
      name: 'Type',
      selector: (row) => row.type,
    },
    {
      id: 'name',
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    // TODO: missing type response
    {
      name: 'Locations',
      selector: (row) => row.locations,
    },
    {
      id: 'created_at',
      name: 'Date Imported',
      selector: (row) => row.created_at,
      sortable: true,
    },
  ]

  return <DataTableComponent columns={columns} data={data} />
}

export default ImportsTable
