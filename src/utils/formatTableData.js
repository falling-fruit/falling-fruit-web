export const tableData = [
  {
    id: 1,
    common_name: 'Honey locust',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['https://fallingfruit.org/wikipedia_icon.png'],
    locations: 9,
  },
  {
    id: 2,
    common_name: 'Honey qqq',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['https://fallingfruit.org/wikipedia_icon.png'],
    locations: 9,
  },
  {
    id: 3,
    common_name: 'ddd rrr',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['https://fallingfruit.org/wikipedia_icon.png'],
    locations: 5,
  },
  {
    id: 4,
    common_name: 'ss ff',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['i  ', 'b '],
    locations: 9,
  },
  {
    id: 5,
    common_name: 'Honey dd',
    scientific_name: " pseudoacacia 'Unifoliola",
    links: [],
    locations: 4,
  },
]

export default function getTableData(data) {
  // object initialization
  let result = {
    columns: new Map(),
    data,
  }
  let columns = new Map()

  // return on null case
  if (data.length === 0) {
    return result
  }

  //declare column objects
  let json_keys = Object.keys(data[0])
  for (var i = 0; i < json_keys.length; i++) {
    let key = json_keys[i]
    if (key === 'id') {
      continue
    }

    //default column object
    let column = {
      id: '',
      name: '',
      selector: (row) => row[key],
      sortable: false,
    }

    // unique column id
    column.id = key

    // column title
    let splits = key.split('_')
    let name = ''
    for (var j = 0; j < splits.length; j++) {
      let str = splits[j]
      let lower = str.toLowerCase()
      // eslint-disable-next-line prefer-template
      name = name + str.charAt(0).toUpperCase() + lower.slice(1) + ' '
    }
    column.name = name

    // append to columns object
    columns.set(key, column)
  }
  result.columns = columns
  return result
}
