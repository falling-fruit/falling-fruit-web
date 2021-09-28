import DataTable from 'react-data-table-component'

const DataTableComponent = ({ data, columns }) => (
  <DataTable pagination columns={columns} data={data} />
)

export default DataTableComponent
