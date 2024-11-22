import { Search as SearchIcon } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components/macro'

import harvestData from '../../constants/data/harvest.json'
import Facebook from '../entry/icons/Facebook.svg'
import X from '../entry/icons/X-square.svg'
import Input from '../ui/Input'
import DataTable from './DataTable'
import { TablePreviewLink } from './DataTableProperties'

const OrganizationName = styled.span`
  ${({ $isActive }) =>
    !$isActive &&
    `
  opacity: 0.5;
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
  <OrganizationName $isActive={active}>
    {name_url ? (
      <a href={name_url} target="_blank" rel="noreferrer">
        {name}
      </a>
    ) : (
      name
    )}
    {subname && ' > '}
    {subname &&
      (subname_url ? (
        <a href={subname_url} target="_blank" rel="noreferrer">
          {subname}
        </a>
      ) : (
        <>{subname}</>
      ))}
  </OrganizationName>
)

const FormattedSocials = ({ facebook, x }) => {
  if (!facebook && !x) {
    return null
  }
  return (
    <>
      {facebook && (
        <TablePreviewLink href={facebook} target="_blank" rel="noreferrer">
          <img src={Facebook} alt={'Facebook logo'} />
        </TablePreviewLink>
      )}
      {x && (
        <TablePreviewLink href={x} target="_blank" rel="noreferrer">
          <img src={X} alt={`X logo`} />
        </TablePreviewLink>
      )}
    </>
  )
}

const columns = [
  {
    id: 'country',
    name: 'Country',
    selector: (row) => row.country ?? '-',
    sortable: true,
    wrap: true,
  },
  {
    id: 'state',
    name: 'State',
    selector: (row) => row.state ?? '-',
    sortable: true,
    wrap: true,
  },
  {
    id: 'city',
    name: 'City',
    selector: (row) => row.city ?? '-',
    sortable: true,
    wrap: true,
  },
  {
    id: 'name',
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    grow: 2.5,
    format: FormattedOrganization,
    wrap: true,
  },
  {
    id: 'social',
    name: 'Social',
    selector: (row) => row.facebook || row.x,
    format: FormattedSocials,
    compact: true,
    width: '80px',
    right: true,
  },
]

const ShareTheHarvestTable = () => {
  const [filterText, setFilterText] = React.useState('')

  const filteredData = harvestData.filter((item) => {
    const query = filterText.toLowerCase()
    const keywords = [item.country, item.state, item.city, item.name]
    return keywords.some(
      (keyword) => keyword && keyword.toLowerCase().includes(query),
    )
  })

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      defaultSortFieldId={'country'}
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
    />
  )
}

export default ShareTheHarvestTable
