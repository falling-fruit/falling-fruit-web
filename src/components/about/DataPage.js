import ImportsTable from '../table/ImportsTable'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const DataPage = () => (
  <PageScrollWrapper>
    <PageTemplate from="Settings">
      <p>
        Falling Fruit is built on public data and the generosity of our users.
        We want urban foraging to reach as many people as possible, and we
        believe that everyone should have equal access to the fruits of our
        collective labor. In the spirit of openness, behold! The entire
        database:
      </p>
      <blockquote>
        <a href="https://fallingfruit.org/locations.csv.bz2" dir="ltr">
          locations.csv.bz2
        </a>
        <br />
        <a href="https://fallingfruit.org/types.csv.bz2" dir="ltr">
          types.csv.bz2
        </a>
      </blockquote>
      <p>
        But beware! Once uncompressed, the database is a huge file that will
        crush most spreadsheet software. If you only need data for a small
        region, first try retrieving them using the download tool integrated
        into the <a href="https://fallingfruit.org">map</a>.
      </p>
      <p>
        If you are interested in using the data in your project, especially a
        commercial project, we suggest you contact us (
        <a href="mailto:info@fallingfruit.org">info@fallingfruit.org</a>).
        Unless otherwise specified, data are licensed as{' '}
        <a
          rel="license"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0"
        >
          CC BY-NC-SA
        </a>{' '}
        (Creative Commons – Attribution, Non-commercial, Share-alike). This
        means that you are free to use and distribute the data so long as you
        preserve the original author/source attributions and do not use it
        (without permission) for commercial applications. The source code for
        Falling Fruit is also open, and available on{' '}
        <a href="https://github.com/falling-fruit">GitHub</a>.
      </p>
      <p>
        We take no responsibility for the accuracy of the data - it is provided
        as is, <i>caveat emptor</i>. If you do something cool with the data,
        please <a href={'mailto:info@fallingfruit.org'}>let us know</a>!
      </p>

      <h2>Imported datasets</h2>
      <p>
        Falling Fruit aspires to be the most comprehensive and open geographic
        dataset of urban edibles. While our users explore, edit, and add
        locations using our map, we comb the known universe for pre-existing
        datasets and import them directly into the database, uniting the efforts
        of foragers, foresters, and freegans everywhere. If you know of a
        dataset we've missed, please let us know! You can also help us with the
        import process by formatting the data using the{' '}
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

export default DataPage
