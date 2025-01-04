import { components } from './apiSchema'

type Review = components['schemas']['Review']

interface ReviewSummary {
  quality: {
    average: number | null
    count: number
  }
  yield: {
    average: number | null
    count: number
  }
  fruiting: {
    flowers: number[]
    unripe: number[]
    ripe: number[]
  }
}

export const createReviewSummary = (reviews: Review[]): ReviewSummary => {
  let qualitySum = 0
  let qualityCount = 0
  for (const review of reviews) {
    if (review.quality_rating !== null) {
      qualitySum += review.quality_rating || 0
      qualityCount++
    }
  }

  let yieldSum = 0
  let yieldCount = 0
  for (const review of reviews) {
    if (review.yield_rating !== null) {
      yieldSum += review.yield_rating || 0
      yieldCount++
    }
  }

  const validFruitingReviews = reviews.filter(
    (review) => review.observed_on && review.fruiting !== null,
  )

  const fruitingByMonth = {
    flowers: validFruitingReviews
      .filter(
        (review): review is Review & { observed_on: string } =>
          review.fruiting === 0 && review.observed_on !== null,
      )
      .map((review) => new Date(review.observed_on).getMonth())
      .sort((a, b) => a - b),
    unripe: validFruitingReviews
      .filter(
        (review): review is Review & { observed_on: string } =>
          review.fruiting === 1 && review.observed_on !== null,
      )
      .map((review) => new Date(review.observed_on).getMonth())
      .sort((a, b) => a - b),
    ripe: validFruitingReviews
      .filter(
        (review): review is Review & { observed_on: string } =>
          review.fruiting === 2 && review.observed_on !== null,
      )
      .map((review) => new Date(review.observed_on).getMonth())
      .sort((a, b) => a - b),
  }

  return {
    quality: {
      average: qualityCount > 0 ? qualitySum / qualityCount : null,
      count: qualityCount,
    },
    yield: {
      average: yieldCount > 0 ? yieldSum / yieldCount : null,
      count: yieldCount,
    },
    fruiting: {
      flowers: fruitingByMonth.flowers.sort((a, b) => a - b),
      unripe: fruitingByMonth.unripe.sort((a, b) => a - b),
      ripe: fruitingByMonth.ripe.sort((a, b) => a - b),
    },
  }
}
