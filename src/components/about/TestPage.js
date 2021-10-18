import PhotoGridTemplate from '../entry/NewPhotoGrid'
import ImportsTable from '../table/ImportsTable'
import PageTemplate from './PageTemplate'

const photos = [
  'https://fallingfruit.org/amittai-mulberries.jpg',
  'https://fallingfruit.org/amittai-mulberries.jpg',
  'https://fallingfruit.org/amittai-mulberries.jpg',
  'https://fallingfruit.org/amittai-mulberries.jpg',
]
const TestPage = () => (
  <PageTemplate>
    <PhotoGridTemplate photos={photos} float={'right'} />
    <h1>Page Example</h1>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s. Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s. Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s. Lorem Ipsum is simply dummy text of the
      printing and typesetting industry. Lorem Ipsum has been the industry's
      standard dummy text ever since the 1500s.
    </p>
    <h2>Example 2</h2>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s. Lorem Ipsum is simply dummy text of the.
    </p>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s. Lorem Ipsum is simply dummy text of the.
    </p>

    <h3>Example 3</h3>
    <p>
      Lorem Ipsum is simply dummy text of the printing and example link click
      here <a href="google.com">riya !sucks</a>. Lorem Ipsum has been the
      industry's standard dummy text ever since the 1500s.
    </p>

    <ImportsTable />
  </PageTemplate>
)

export default TestPage
