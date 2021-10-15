import PhotoGridTemplate from '../entry/NewPhotoGrid'
import ImportsTable from '../table/ImportsTable'
import PageTemplate from './PageTemplate'

const photos = [
  'http://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/thumb/open-uri20131213-3992-1szjh9k.jpg',
  'http://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/thumb/open-uri20131213-3992-1szjh9k.jpg',
  'http://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/thumb/open-uri20131213-3992-1szjh9k.jpg',
  'http://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/thumb/open-uri20131213-3992-1szjh9k.jpg',
]
const TestPage = () => (
  <PageTemplate>
    <h1>hey girlfriend</h1>
    <h2>hey boyfriend</h2>
    <h3>hey friend</h3>
    <p>ashank sucks</p>
    <a href="google.com">riya !sucks</a>
    <ImportsTable />
    <PhotoGridTemplate photos={photos} float={'right'} />
  </PageTemplate>
)

export default TestPage
