import DataTable from 'react-data-table-component'

const DataTableComponent = ({ data, columns }) => (
  //   const [selectedRows, setSelectedRows] = useState([])

  //   const data = [
  //     {
  //       id: 1,
  //       title: 'Beetlejuice',
  //       year: '1988',
  //     },
  //     {
  //       id: 2,
  //       title: 'Ghostbusters',
  //       year: '1984',
  //     },
  //   ]

  //   const columns = [
  //     {
  //       name: 'Title',
  //       selector: (row) => row.title,
  //       sortable: true,
  //     },
  //     {
  //       name: 'Year',
  //       selector: (row) => row.year,
  //       sortable: true,
  //     },
  //   ]

  <DataTable pagination columns={columns} data={data} />
)

export default DataTableComponent
