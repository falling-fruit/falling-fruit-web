import DataTable from 'react-data-table-component'
import styled from 'styled-components/macro'

import { RESOURCES } from '../entry/resources'

const DataTableWrapper = styled.div`
  .rdt {
    &_TableHeadRow {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
    }
    &_TableCell {
      font-size: 14px;
      &[data-column-id='scientific_name'] {
        font-style: italic;
      }
    }
  }
`

const ResourceList = ({ url, key }) =>
  RESOURCES.map(
    ({ title, urlKey, icon }) =>
      url.includes(urlKey) && (
        <TableLinkPreview src={icon} key={key} alt={`${title} logo`} />
      ),
  )
const TableLinkPreview = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`

const FORMATTERS = {
  links: ({ links }) =>
    links.map((link, index) => <ResourceList key={index} url={link} />),
  name: ({ links }) =>
    links.map((link, index) => (
      <a key={index} href={link}>
        {link}
      </a>
    )),
}

const DataTableComponent = ({ data, columns, sortedColumns }) => {
  function setColumnFormat() {
    Array.from(columns.keys()).forEach((key) => {
      if (key in FORMATTERS) {
        const json = columns.get(key)
        json.format = FORMATTERS[key]
        columns.set(key, json)
      }
    })
  }

  function setSortableColumns() {
    setColumnFormat()
    for (let i = 0; i < sortedColumns.length; i++) {
      const key = sortedColumns[i].id

      if (!columns.has(key)) {
        continue
      }
      const json = columns.get(key)
      json.sortable = true
      if (sortedColumns[i].customSort) {
        json.sortFunction = sortedColumns[i].sortFunction
      }
      columns.set(key, json)
    }
    return Array.from(columns.values())
  }

  return (
    <DataTableWrapper>
      <DataTable pagination columns={setSortableColumns()} data={data} />
    </DataTableWrapper>
  )
}

export default DataTableComponent
