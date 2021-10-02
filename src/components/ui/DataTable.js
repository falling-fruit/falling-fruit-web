import { Flag } from '@styled-icons/boxicons-solid'
import DataTable from 'react-data-table-component'
import styled from 'styled-components/macro'

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

const DataTableComponent = ({ data, columns, sortedColumn }) => {
  function setSortableColumns() {
    if (columns.has('links')) {
      let json = columns.get('links')
      json.format = (row) => {
        const links = row.links
        return links.map((link, index) => (
          <a key={index} href={link}>
            <Flag size={20} />
          </a>
        ))
      }
      columns.set('links', json)
    }

    for (let i = 0; i < sortedColumn.length; i++) {
      let key = sortedColumn[i].id
      if (!columns.has(key)) {
        continue
      }
      let json = columns.get(key)
      json.sortable = true
      if (sortedColumn[i].custom_sort) {
        json.sortFunction = sortedColumn[i].sortFunction
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
