import ReactDataTable from 'react-data-table-component'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

const LoaderWrapper = styled.div`
  width: 100%;
  pointer-events: none;

  span {
    width: 100%;

    .react-loading-skeleton {
      display: block;
      width: 100%;
    }
  }

  .rdt {
    &_TableRow {
      display: flex;
      padding: 16px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    &_TableCell {
      flex: 1;
      padding: 0 16px;
    }
  }
`
const TableLoader = () => (
  <LoaderWrapper>
    {new Array(10).fill(
      <div className="rdt_TableRow">
        <div className="rdt_TableCell">
          <Skeleton />
        </div>
        <div className="rdt_TableCell">
          <Skeleton />
        </div>
        <div className="rdt_TableCell">
          <Skeleton />
        </div>
        <div className="rdt_TableCell">
          <Skeleton />
        </div>
        <div className="rdt_TableCell">
          <Skeleton />
        </div>
      </div>,
    )}
  </LoaderWrapper>
)

const TableWrapper = styled.div`
  .rdt {
    &_TableHeadRow {
      font-size: 1rem;
      font-weight: bold;
    }

    &_TableRow {
      font-size: 1rem;
      ${({ $onRowClicked, theme }) =>
        $onRowClicked &&
        `
      cursor: pointer;
      &:hover {
        background-color: ${theme.secondaryBackground};
      }
      `}
    }
  }
`

const DataTable = ({ ...props }) => (
  <TableWrapper $onRowClicked={props.onRowClicked}>
    <ReactDataTable progressComponent={<TableLoader />} pagination {...props} />
  </TableWrapper>
)

export default DataTable
