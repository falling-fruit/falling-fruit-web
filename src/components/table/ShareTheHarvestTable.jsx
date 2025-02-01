import { Facebook, Instagram } from '@styled-icons/boxicons-logos'
import { Search as SearchIcon } from '@styled-icons/boxicons-regular'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import harvestData from '../../constants/data/harvest.json'
import X from '../../constants/X.svg'
import { theme } from '../ui/GlobalStyle'
import Input from '../ui/Input'
import DataTable from './DataTable'

const TablePreviewLink = styled.a`
  display: inline-flex;
  align-items: center;
  height: 20px;
  width: 20px;
  margin-right: 5px;

  img {
    width: 100%;
    height: auto;
    margin: 0;
  }
`

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

const FormattedSocials = ({ facebook, instagram, x }) => {
  if (!facebook && !instagram && !x) {
    return null
  }
  return (
    <>
      {facebook && (
        <TablePreviewLink href={facebook} target="_blank" rel="noreferrer">
          <Facebook color={theme.text} />
        </TablePreviewLink>
      )}
      {instagram && (
        <TablePreviewLink href={instagram} target="_blank" rel="noreferrer">
          <Instagram color={theme.text} />
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

const ShareTheHarvestTable = () => {
  const [filterText, setFilterText] = React.useState('')
  const { t } = useTranslation()

  const translatedCountries = {
    Australia: t('glossary.australia'),
    Belgium: t('glossary.belgium'),
    Brazil: t('glossary.brazil'),
    Canada: t('glossary.canada'),
    Chile: t('glossary.chile'),
    Czechia: t('glossary.czechia'),
    Fiji: t('glossary.fiji'),
    Finland: t('glossary.finland'),
    France: t('glossary.france'),
    Germany: t('glossary.germany'),
    Greece: t('glossary.greece'),
    Ireland: t('glossary.ireland'),
    Italy: t('glossary.italy'),
    'New Zealand': t('glossary.new_zealand'),
    Portugal: t('glossary.portugal'),
    Spain: t('glossary.spain'),
    Sweden: t('glossary.sweden'),
    Switzerland: t('glossary.switzerland'),
    'United Kingdom': t('glossary.united_kingdom'),
    'United States': t('glossary.united_states'),
  }

  const columns = [
    {
      id: 'country',
      name: 'Country',
      selector: (row) => translatedCountries[row.country] || row.country || '-',
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
      selector: (row) => row.facebook || row.instagram || row.x,
      format: FormattedSocials,
      compact: true,
      width: '80px',
      right: true,
    },
  ]

  const filteredData = harvestData.filter((item) => {
    const query = filterText.toLowerCase()
    const translatedCountry = translatedCountries[item.country] || item.country
    const keywords = [translatedCountry, item.state, item.city, item.name]
    return keywords.some(
      (keyword) =>
        keyword && keyword.toLowerCase && keyword.toLowerCase().includes(query),
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
