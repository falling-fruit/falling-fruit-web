import ImportsTable from '../table/ImportsTable'
import PageTemplate from './PageTemplate'

const TestPage = () => (
  <PageTemplate>
    <p>
      Falling Fruit aspires to be the most comprehensive and open geographic
      dataset of urban edibles. While our users explore, edit, and add locations
      using our map, we comb the known universe for pre-existing datasets and
      import them directly into the{' '}
      <a href={'https://fallingfruit.org/data?locale=en'}>database</a>, uniting
      the efforts of foragers, foresters, and freegans everywhere. If you know
      of a dataset we've missed, please let us know! You can also help us with
      the import process by formatting the data using the import template. Note
      that since imports must be performed manually, all changes to the original
      data made after the import are not reflected on Falling Fruit.
    </p>

    <ImportsTable />
  </PageTemplate>
)

export default TestPage
