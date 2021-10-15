import { default as ReactDataTable } from 'react-data-table-component'
import styled from 'styled-components/macro'

const DataTableWrapper = styled(ReactDataTable)`
  .rdt {
    &_TableHeadRow {
      font-style: normal;
      font-weight: bold;
      font-size: 1rem;
    }
    &_TableCell {
      font-size: 1rem;
      &[data-column-id='scientific_name'] {
        font-style: italic;
      }
    }
  }
`

const DataTable = (props) => <DataTableWrapper pagination {...props} />

export default DataTable
