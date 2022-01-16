const axios = require('axios')
const fs = require('fs')

const [, , BASE_URL, OUTPUT_DIR] = process.argv

if (!BASE_URL || !OUTPUT_DIR) {
  process.exit(1)
}

const GENERAL_SUBSTITUTIONS = {
  '': null,
  FALSE: false,
  TRUE: true,
}

const PRESS_URL = `${BASE_URL}/press`
const PRESS_OUTPUT = `${OUTPUT_DIR}/press.json`

const HARVEST_URL = `${BASE_URL}/organizations`
const HARVEST_OUTPUT = `${OUTPUT_DIR}/harvest.json`
const HARVEST_SUBSTITUTIONS = {
  ...GENERAL_SUBSTITUTIONS,
  '-': null,
}
const PRESS_KEYS = [
  'published_on',
  'outlet',
  'outlet_url',
  'title',
  'author',
  'url',
  'embed_html',
  'photo_url',
]
const HARVEST_KEYS = [
  'active',
  'country',
  'state',
  'city',
  'name',
  'name_url',
  'subname',
  'subname_url',
  'facebook',
  'twitter',
  'instagram',
]

const isIncluded = ({ include }) => !!include

const substituteBy = (substitutions) => (rawRow) => {
  const substitutedRow = {}
  Object.keys(rawRow).forEach((col) => {
    const cell = rawRow[col]
    substitutedRow[col] = cell
    if (substitutions[cell] !== undefined) {
      substitutedRow[col] = substitutions[cell]
    }
  })

  return substitutedRow
}

const getDataByYear = (rows) =>
  rows.reduce((dataByYear, row) => {
    const year = new Date(row.published_on).getFullYear()
    if (!dataByYear[year]) {
      dataByYear[year] = []
    }
    dataByYear[year].push(row)
    return dataByYear
  }, {})

async function getAndWriteData(
  url,
  output,
  substitutions = {},
  formatters = [],
  keys = null,
) {
  const { data } = await axios.get(url)
  let processed = data.map(substituteBy(substitutions)).filter(isIncluded)

  // Keep only keys that are listed and have truthy values
  if (keys) {
    processed = processed.map((row) =>
      Object.keys(row)
        .filter((key) => row[key] && keys.includes(key))
        .reduce((obj, key) => {
          obj[key] = row[key]
          return obj
        }, {}),
    )
  }

  const formatted = formatters.reduce(
    (unformatted, formatter) => formatter(unformatted),
    processed,
  )

  // Indent and insert a new line to match autoformatting
  const fileData = `${JSON.stringify(formatted, null, 2)}\n`
  fs.writeFile(output, fileData, (e) => {
    if (e) {
      throw e
    }
    console.log(`Data file generated and saved to ${output}`)
  })
}

getAndWriteData(
  PRESS_URL,
  PRESS_OUTPUT,
  GENERAL_SUBSTITUTIONS,
  [getDataByYear],
  PRESS_KEYS,
)
getAndWriteData(
  HARVEST_URL,
  HARVEST_OUTPUT,
  HARVEST_SUBSTITUTIONS,
  [],
  HARVEST_KEYS,
)
