import ReactDataTable from 'react-data-table-component'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'

const LOADER_ROWS = 10

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
      border-block-end: 1px solid rgba(0, 0, 0, 0.12);
    }

    &_TableCell {
      flex: 1;
      padding: 0 16px;
    }
  }
`

const TableLoader = ({ columns }) => (
  <LoaderWrapper>
    {Array.from(Array(LOADER_ROWS), (_, i) => (
      <div className="rdt_TableRow" key={i}>
        {Array.from(Array(columns.length), (_, j) => (
          <div className="rdt_TableCell" key={j}>
            <Skeleton />
          </div>
        ))}
      </div>
    ))}
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
    <ReactDataTable
      progressComponent={<TableLoader columns={props.columns} />}
      {...props}
    />
  </TableWrapper>
)

export default DataTable
