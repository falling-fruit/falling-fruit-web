import { Search as SearchIcon } from '@styled-icons/boxicons-regular'
import React from 'react'

import harvestData from '../../constants/data/harvest.json'
import Input from '../ui/Input'
import DataTable from './DataTable'
import { FORMATTERS } from './DataTableProperties'

const columns = [
  {
    id: 'name',
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    grow: 2,
  },
  {
    id: 'country',
    name: 'Country',
    selector: (row) => row.country ?? 'Global',
    sortable: true,
  },
  {
    id: 'location',
    name: 'Location',
    selector: (row) => row.state + row.city,
    sortable: true,
    format: FORMATTERS.location,
  },
  {
    id: 'link',
    name: 'Organization Link',
    selector: (row) => row.name_url,
    format: ({ name_url: url }) => FORMATTERS.link({ url }),
  },
  {
    id: 'social',
    name: 'Social Media',
    selector: (row) => row.facebook + row.twitter,
    format: ({ facebook, twitter }) =>
      FORMATTERS.links({ links: [facebook, twitter].filter(Boolean) }),
  },
]

const ShareTheHarvestTable = () => {
  const [filterText, setFilterText] = React.useState('')

  const filteredData = harvestData.filter((item) => {
    const query = filterText.toLowerCase()
    const keywords = [item.name, item.country, item.location]
    return keywords.some(
      (keyword) => keyword && keyword.toLowerCase().includes(query),
    )
  })

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      pagination
      subHeader
      subHeaderComponent={
        <Input
          placeholder="Search for an org"
          icon={<SearchIcon />}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          onClear={() => setFilterText('')}
        />
      }
      persistTableHead
    />
  )
}

export default ShareTheHarvestTable
