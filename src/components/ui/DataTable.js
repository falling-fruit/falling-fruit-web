import { default as ReactDataTable } from 'react-data-table-component'
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
const TableLinkPreview = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`

const customLinkSort = (rowOne, rowTwo) => {
  if (rowOne.links.length > rowTwo.links.length) {
    return 1
  } else if (rowTwo.links.length > rowOne.links.length) {
    return -1
  }
  return 0
}

const customDateSort = (rowOne, rowTwo) => {
  const dateOne = new Date(rowOne.created_at)
  const dateTwo = new Date(rowTwo.created_at)

  if (dateOne < dateTwo) {
    return -1
  } else if (dateTwo > dateOne) {
    return 1
  } else {
    return 0
  }
}

const ResourceList = ({ url, key }) =>
  RESOURCES.map(
    ({ title, urlKey, icon }) =>
      url.includes(urlKey) && (
        <TableLinkPreview src={icon} key={key} alt={`${title} logo`} />
      ),
  )

const FORMATTERS = {
  links: ({ links }) =>
    links.map((link, index) => <ResourceList key={index} url={link} />),
  // eslint-disable-next-line react/display-name
  name: ({ name }) => <a href={name}>{name}</a>,
  created_at: ({ created_at }) =>
    new Date(created_at).toISOString().split('T')[0],
}

const SORTERS = {
  links: customLinkSort,
  created_at: customDateSort,
}

const DataTable = ({ data, columns }) => {
  const setColumnFormat = () => {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      const key = column.id
      if (key in FORMATTERS) {
        column.format = FORMATTERS[key]
        columns[i] = column
      }
    }
  }

  const setSortableColumns = () => {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      const key = column.id
      if (key in SORTERS) {
        column.sortableFunction = SORTERS[key]
        columns[i] = column
      }
    }
    return columns
  }

  const setColumnProperties = () => {
    setColumnFormat()
    return setSortableColumns()
  }

  return (
    <DataTableWrapper>
      <ReactDataTable pagination columns={setColumnProperties()} data={data} />
    </DataTableWrapper>
  )
}

export default DataTable
