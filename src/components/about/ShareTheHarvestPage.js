import ShareTheHarvestTable from '../table/ShareTheHarvestTable'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const ImportedDatasetsPage = () => (
  <PageScrollWrapper>
    <PageTemplate>
      <h1>Grow &middot; Pick &middot; Distribute</h1>
      <p>
        Listed below are organizations that grow food in public spaces (food
        forests, public orchards), pick food (urban foraging, farm gleaning), or
        distribute food (exchanges, donations). Organizations are listed by
        country, state (if applicable), and city. Those with crossed-out names
        are believed to be inactive. If you know of others that should be on
        this list, <a href="mailto:info@fallingfruit.org">contact us</a>!
      </p>
      <ShareTheHarvestTable />
    </PageTemplate>
  </PageScrollWrapper>
)

export default ImportedDatasetsPage
