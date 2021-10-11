import { default as ReactDataTable } from 'react-data-table-component'
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

const DataTable = ({ data, columns }) => (
  <DataTableWrapper>
    <ReactDataTable pagination columns={columns} data={data} />
  </DataTableWrapper>
)

export default DataTable
