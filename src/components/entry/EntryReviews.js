import Review from '../ui/Review'
import { Page, TextContent } from './EntryTabs'

const RATINGS = [
  { label: 'Fruiting', percentage: 0.1 },
  { label: 'Quality', percentage: 0.8 },
  { label: 'Yield', percentage: 0.5 },
]

const EntryReviews = () => {
  console.log('hi')

  return (
    <Page>
      <TextContent>
        <h2>Reviews</h2>
        <Review
          ratings={RATINGS}
          description="Great place to find fruits, however yield is pretty low which makes me mad >:("
          date="12/09/2002"
          name="Rebecca Xun"
        ></Review>
        <Review
          ratings={RATINGS}
          description="Great place to find fruits, however yield is pretty low which makes me mad >:("
          date="12/09/2002"
          name="Rebecca Xun"
        />
        <Review
          ratings={RATINGS}
          description="Great place to find fruits, however yield is pretty low which makes me mad >:("
          date="12/09/2002"
          name="Rebecca Xun"
        />
      </TextContent>
    </Page>
  )
}

export default EntryReviews
