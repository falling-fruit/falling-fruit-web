import { Search as SearchIcon } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components/macro'

import harvestData from '../../constants/data/harvest.json'
import Input from '../ui/Input'
import DataTable from './DataTable'
import { FORMATTERS } from './DataTableProperties'

const OrganizationLink = styled.a`
  ${({ $isActive }) =>
    !$isActive &&
    `
  text-decoration: line-through;
`}
`

// TODO: Consider updating organization name formatting
const FormattedOrganization = ({
  name,
  name_url,
  subname,
  subname_url,
  active,
}) => (
  <>
    {name_url ? (
      <OrganizationLink
        $isActive={active}
        href={name_url}
        target="_blank"
        rel="noreferrer"
      >
        {name}
      </OrganizationLink>
    ) : (
      name
    )}
    {subname &&
      (subname_url ? (
        <a href={subname_url} target="_blank" rel="noreferrer">
          {' '}
          ({subname})
        </a>
      ) : (
        <> ({subname})</>
      ))}
  </>
)

const columns = [
  {
    id: 'name',
    name: 'Organization Name',
    selector: (row) => row.name,
    sortable: true,
    grow: 2,
    format: FormattedOrganization,
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
