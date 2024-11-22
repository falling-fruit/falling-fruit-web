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
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    &_TableCell {
      flex: 1;
      padding: 0 16px;
    }
  }
`
const TableLoader = ({ columns }) => (
  <LoaderWrapper>
    {new Array(LOADER_ROWS).fill(
      <div className="rdt_TableRow">
        {new Array(columns.length).fill(
          <div className="rdt_TableCell">
            <Skeleton />
          </div>,
        )}
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

    &_TableCell {
      &[data-column-id='social'] {
        div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
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
