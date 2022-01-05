const axios = require('axios')
const fs = require('fs')

const PRESS_DATA_ROUTE = './src/constants/press_data.json'

const SUBSTITUTIONS = {
  '': null,
  FALSE: false,
  TRUE: true,
}

async function fetchData() {
  return await axios.get(
    'https://opensheet.elk.sh/1GSB07pn7RMbZbFwv85CextwGzUTTGE2ZJZxn0XxvoEg/press',
  )
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
  fs.writeFile(PRESS_DATA_ROUTE, fileData, (e) => {
    if (e) {
      throw e
    }
    console.log(`Press data file generated and saved to ${PRESS_DATA_ROUTE}`)
  })
}

main()
