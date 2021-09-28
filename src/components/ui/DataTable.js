import DataTable from 'react-data-table-component'

const DataTableComponent = ({ data, columns, sorted_columns }) => {
  function set_sortable() {
    for (var i = 0; i < sorted_columns.length; i++) {
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

  return <DataTable pagination columns={set_sortable()} data={data} />
}

export default DataTableComponent
