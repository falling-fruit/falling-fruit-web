const axios = require('axios')
const fs = require('fs')

const [, , API_URL, OUTPUT] = process.argv

if (!API_URL || !OUTPUT) {
  process.exit(1)
}

const SUBSTITUTIONS = {
  '': null,
  FALSE: false,
  TRUE: true,
}

function processSubstitutions(rawRow) {
  const processedRow = {}
  Object.keys(rawRow).forEach((col) => {
    const cell = rawRow[col]
    processedRow[col] = cell
    if (SUBSTITUTIONS[cell] !== undefined) {
      processedRow[col] = SUBSTITUTIONS[cell]
    }
  })

  return processedRow
}

function getDataByYear(processedRows) {
  const dataByYear = {}

  processedRows.forEach((row) => {
    const year = new Date(row.published_on).getFullYear()
    if (!dataByYear[year]) {
      dataByYear[year] = []
    }
    dataByYear[year].push(row)
  })

  return dataByYear
}

async function main() {
  const { data } = await axios.get(API_URL)
  const processed = data
    .map(processSubstitutions)
    .filter(({ include }) => !!include)
  const processedByYear = getDataByYear(processed)
  const fileData = JSON.stringify(processedByYear)
  fs.writeFile(OUTPUT, fileData, (e) => {
    if (e) {
      throw e
    }
    console.log(`Press data file generated and saved to ${OUTPUT}`)
  })
}

main()
