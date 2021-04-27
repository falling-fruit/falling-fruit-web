import Rating from '../ui/Rating'
import { Page, TextContent } from './EntryTabs'

const EntryReviews = () => {
  console.log('hi')

  return (
    <Page>
      <TextContent>
        <h2>Reviews</h2>
        <Rating title="Fruiting" score={44} />
      </TextContent>
    </Page>
  )
}

export default EntryReviews
