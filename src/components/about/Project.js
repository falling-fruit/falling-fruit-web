import PhotoGridTemplate from '../entry/NewPhotoGrid'
import PageTemplate from './PageTemplate'

const photos = [
  'https://fallingfruit.org/ethan-oranges.jpg',
  'https://fallingfruit.org/jeff-tree.jpg',
  'https://fallingfruit.org/plums.jpg',
  'https://fallingfruit.org/amittai-mulberries.jpg',
]
const Project = () => (
  <PageTemplate>
    <PhotoGridTemplate photos={photos} float={'right'} />
    <p>
      <em>
        Falling Fruit is not associated with Fallen Fruit. Fallen Fruit can be
        found at fallenfruit.org.
      </em>
    </p>
    <h3>Donate</h3>
    <p>
      <em>
        We are a 501(c)(3) nonprofit and rely on donations to operate. If you
        are willing and able, please consider making a financial contribution.
        Donations within the United States are tax deductible.
      </em>
    </p>
    <h3>Write</h3>
    <p>
      <em>
        Falling Fruit is built by and for foragers – we want it to be the best
        tool available to the contemporary forager. Write us at
        <a href="feedback@fallingfruit.org"> feedback@fallingfruit.org</a>, we
        would love to hear from you!
      </em>
    </p>
    <h2>About the project</h2>
    <h3>Translate</h3>
    <p>
      <em>
        Interested in volunteering as a translator? Email us and we'll invite
        you to join us on Phrase, where our translations are managed.
      </em>
    </p>
  </PageTemplate>
)

export default Project
