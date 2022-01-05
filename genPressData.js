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

async function fetchData() {
  return await axios.get(API_URL)
}

function processRow(rawRow) {
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

function processData(raw) {
  return raw.map(processRow)
}

async function main() {
  const { data } = await fetchData()
  const processed = processData(data)
  const fileData = JSON.stringify(processed)
  fs.writeFile(OUTPUT, fileData, (e) => {
    if (e) {
      throw e
    }
    console.log(`Press data file generated and saved to ${OUTPUT}`)
  })
}

main()
