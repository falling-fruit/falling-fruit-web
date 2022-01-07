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
) {
  const { data } = await axios.get(url)
  const processed = data.map(substituteBy(substitutions)).filter(isIncluded)

  const formatted = formatters.reduce(
    (unformatted, formatter) => formatter(unformatted),
    processed,
  )

  const fileData = JSON.stringify(formatted)
  fs.writeFile(output, fileData, (e) => {
    if (e) {
      throw e
    }
    console.log(`Data file generated and saved to ${output}`)
  })
}

getAndWriteData(PRESS_URL, PRESS_OUTPUT, GENERAL_SUBSTITUTIONS, [getDataByYear])
getAndWriteData(HARVEST_URL, HARVEST_OUTPUT, HARVEST_SUBSTITUTIONS)
