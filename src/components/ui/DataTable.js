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

const DataTableComponent = ({ data, columns, sorted_columns }) => {
  function set_sortable_columns() {
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

    for (let i = 0; i < sorted_columns.length; i++) {
      let key = sorted_columns[i].id
      if (!columns.has(key)) {
        continue
      }
      let json = columns.get(key)
      json.sortable = true
      if (sorted_columns[i].custom_sort) {
        console.log(key)
        json.sortFunction = sorted_columns[i].sortFunction
      }
      columns.set(key, json)
    }
    return Array.from(columns.values())
  }

  return (
    <DataTableWrapper>
      <DataTable pagination columns={set_sortable_columns()} data={data} />
    </DataTableWrapper>
  )
}

export default DataTableComponent
