import {
  LinkExternal,
  Search as SearchIcon,
} from '@styled-icons/boxicons-regular'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getImports } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { theme } from '../ui/GlobalStyle'
import Input from '../ui/Input'
import DataTable from './DataTable'

const ImportsTable = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterText, setFilterText] = React.useState('')
  const history = useAppHistory()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const getImportData = async () => {
      setIsLoading(true)
      setData(await getImports())
      setIsLoading(false)
    }
    getImportData()
  }, [])

  const columns = [
    {
      id: 'type',
      name: t('pages.datasets.type'),
      selector: (row) => row.muni,
      sortable: true,
      format: ({ muni }) =>
        muni
          ? t('glossary.tree_inventory.one')
          : t('pages.datasets.community_map'),
      minWidth: '10em',
    },
    {
      id: 'name',
      name: t('glossary.name'),
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      grow: 3,
    },
    {
      name: t('glossary.locations.other'),
      selector: (row) => row.location_count,
      sortable: true,
      right: true,
    },
    {
      id: 'created_at',
      name: t('pages.datasets.date_imported'),
      selector: (row) => row.created_at,
      sortable: true,
      format: ({ created_at }) =>
        new Date(created_at).toLocaleDateString(i18n.language, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
      center: true,
      minWidth: '8em',
    },
    {
      id: 'link',
      name: t('glossary.links.one'),
      selector: (row) => row.link,
      format: ({ url }) =>
        url && (
          <a href={url} target="_blank" rel="noreferrer">
            <LinkExternal size="14" color={theme.orange} />
          </a>
        ),
      center: true,
      compact: true,
      width: '50px',
    },
  ]

  const filteredData = data.filter((item) => {
    const query = filterText.toLowerCase()
    const keywords = [
      item.name,
      item.muni
        ? t('glossary.tree_inventory.one')
        : t('pages.datasets.community_map'),
      new Date(item.created_at).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
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
