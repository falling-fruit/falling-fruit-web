import ImportsTable from '../table/ImportsTable'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const ImportedDatasetstPage = () => (
  <PageScrollWrapper>
    <PageTemplate>
      <p>
        Falling Fruit aspires to be the most comprehensive and open geographic
        dataset of urban edibles. While our users explore, edit, and add
        locations using our map, we comb the known universe for pre-existing
        datasets and import them directly into the{' '}
        <a href={'https://fallingfruit.org/data?locale=en'}>database</a>,
        uniting the efforts of foragers, foresters, and freegans everywhere. If
        you know of a dataset we've missed, please let us know! You can also
        help us with the import process by formatting the data using the{' '}
        <a
          href={
            'https://docs.google.com/spreadsheets/d/1rqHlf5wtm7incOuHhikAap7M3AdCvW0nnZkiLzmRW6U/edit#gid=0'
          }
        >
          import template
        </a>
        . Note that since imports must be performed manually, all changes to the
        original data made after the import are not reflected on Falling Fruit.
      </p>
      <h2>Imported Datasets</h2>
      <p>
        Datasets imported into Falling Fruit fall into two main categories.
        "Community maps" are built by foragers and freegans as they peruse their
        communities for things to eat. We are indebted to the hardworking
        citizen-cartographers who have compiled this data. "Tree inventories"
        are compiled by cities, universities, and other institutions wishing to
        better document and care for their trees. We mine these vast datasets
        for food-producing species and add them to the map. To help us map your
        neighborhood fruit trees, contact your school or city urging them to
        share their tree inventory with us.
      </p>
      <p>
        Each dataset is listed by name, number of locations, and date imported.
        Expanding each row reveals further details about the data, the import
        process, and the license governing how the data may be used.
      </p>
      <ImportsTable />
    </PageTemplate>
  </PageScrollWrapper>
)

export default ImportedDatasetstPage
