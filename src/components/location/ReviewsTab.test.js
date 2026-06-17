import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import ReviewsTab from './ReviewsTab'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

jest.mock('./InaturalistReviews', () => () => <div data-testid="inaturalist-reviews" />)
jest.mock('./ReviewForm', () => () => <div data-testid="review-form" />)
jest.mock('./ReviewList', () => ({ reviews }) => (
  <div data-testid="review-list">{reviews.length} reviews</div>
))

const makeStore = (reviews) =>
  configureStore({
    reducer: {
      location: () => ({ reviews }),
    },
  })

describe('ReviewsTab', () => {
  it('hides the Reviews header and list when there are no reviews', () => {
    const store = makeStore([])
    render(
      <Provider store={store}>
        <ReviewsTab />
      </Provider>,
    )
    expect(screen.queryByText('glossary.reviews')).not.toBeInTheDocument()
    expect(screen.queryByTestId('review-list')).not.toBeInTheDocument()
  })

  it('shows the Reviews header and list when there are reviews', () => {
    const store = makeStore([{ id: 1, comment: 'Great!' }])
    render(
      <Provider store={store}>
        <ReviewsTab />
      </Provider>,
    )
    expect(screen.getByText('glossary.reviews')).toBeInTheDocument()
    expect(screen.getByTestId('review-list')).toBeInTheDocument()
  })

  it('always renders InaturalistReviews and ReviewForm', () => {
    const store = makeStore([])
    render(
      <Provider store={store}>
        <ReviewsTab />
      </Provider>,
    )
    expect(screen.getByTestId('inaturalist-reviews')).toBeInTheDocument()
    expect(screen.getByTestId('review-form')).toBeInTheDocument()
  })
})
