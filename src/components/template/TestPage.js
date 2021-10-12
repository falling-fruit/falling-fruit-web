import PhotoGrid from '../entry/PhotoGrid'
import ImportsTable from '../table/ImportsTable'
import PageTemplate from './PageTemplate'

const TestPage = () => (
  <PageTemplate>
    <h1>hey girlfriend</h1>
    <h2>hey boyfriend</h2>
    <h3>hey friend</h3>
    <p>ashank sucks</p>
    <a href="google.com">riya !sucks</a>
    <ImportsTable />
    <PhotoGrid />
  </PageTemplate>
)

export default TestPage
