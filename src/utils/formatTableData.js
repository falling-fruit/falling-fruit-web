export const sampleTableData = [
  {
    id: 1,
    common_name: 'Honey locust',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['https://fallingfruit.org/wikipedia_icon.png'],
    locations: 9,
    name: 'https://www.google.com/',
  },
  {
    id: 2,
    common_name: 'Honey qqq',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['https://fallingfruit.org/wikipedia_icon.png'],
    locations: 9,
    name: 'https://www.google.com/',
  },
  {
    id: 3,
    common_name: 'ddd rrr',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: ['https://fallingfruit.org/wikipedia_icon.png'],
    locations: 5,
    name: 'https://www.google.com/',
  },
  {
    id: 4,
    common_name: 'ss ff',
    scientific_name: "Robinia pseudoacacia 'Unifoliola",
    links: [
      'https://fallingfruit.org/wikipedia_icon.png',
      'https://plants.usda.gov/java/profile?symbol=GLTR  ',
    ],
    locations: 9,
    name: 'https://www.google.com/',
  },
  {
    id: 5,
    common_name: 'Honey dd',
    scientific_name: " pseudoacacia 'Unifoliola",
    links: ['ashank ', 'is ', 'hot'],
    locations: 4,
    name: 'https://www.google.com/',
  },
]

export default function getTableData(data) {
  // object initialization
  const result = {
    columns: new Map(),
    data,
  }
  const columns = new Map()

  // return on null case
  if (data.length === 0) {
    return result
  }

  //declare column objects
  const json_keys = Object.keys(data[0])
  for (var i = 0; i < json_keys.length; i++) {
    const key = json_keys[i]
    if (key === 'id') {
      continue
    }

    //default column object
    const column = {
      id: '',
      name: '',
      selector: (row) => row[key],
      sortable: false,
    }

    // unique column id
    column.id = key

    // column title
    const splits = key.split('_')
    let name = ''
    for (const split of splits) {
      let str = split
      let lower = str.toLowerCase()
      name = `${name + str.charAt(0).toUpperCase() + lower.slice(1)} `
    }
    column.name = name

    // append to columns object
    columns.set(key, column)
  }
  result.columns = columns
  return result
}
