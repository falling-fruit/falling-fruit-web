import ReactDataTable from 'react-data-table-component'
import styled from 'styled-components/macro'

const TableWrapper = styled.div`
  .rdt {
    &_TableHeadRow {
      font-size: 1rem;
      font-weight: bold;
    }

    &_TableRow {
      font-size: 1rem;
      cursor: pointer;
    }

    &_TableRow:hover {
      background-color: ${({ theme }) => theme.secondaryBackground};
    }
  }
`

const DataTable = (props) => (
  <TableWrapper>
    <ReactDataTable pagination {...props} />
  </TableWrapper>
)

export default DataTable
