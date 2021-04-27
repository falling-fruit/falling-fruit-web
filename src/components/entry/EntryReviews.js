import styled from 'styled-components/macro'

import Rating from '../ui/Rating'
import { Page, TextContent } from './EntryTabs'

const ReviewDescription = styled.section`
  p {
    font-size: 16px;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0 0 4px 0;
  }
  small {
    font-style: italic;
    font-size: 14px;
  }
`

const EntryReviews = () => {
  console.log('hi')

  return (
    <Page>
      <TextContent>
        <h2>Reviews</h2>
        {/* TODO: Get data from API I assume? */}
        <Rating title="Fruiting" score={90} />
        <Rating title="Quality" score={70} />
        <Rating title="Yield" score={22} />

        <ReviewDescription>
          <p>
            Great place to find fruits, however yield is pretty low which makes
          </p>
          <small>Reviewed June 26, 2019 by Rebecca Xun</small>
        </ReviewDescription>
      </TextContent>
    </Page>
  )
}

export default EntryReviews
