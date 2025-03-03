import { useTranslation } from 'react-i18next'

import { createReviewSummary } from '../../utils/createReviewSummary'
import ReviewStats, { getStarRating, Separator, StatsRow } from './ReviewStats'

const formatMonthList = (months) => {
  if (!months.length) {
    return null
  }

  const monthCounts = months.reduce((acc, month) => {
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const monthsStr = Object.entries(monthCounts)
    .map(([month, count]) => {
      const date = new Date(1, parseInt(month))
      const monthStr = date.toLocaleDateString(undefined, {
        month: 'long',
      })
      return `${monthStr} (${count})`
    })
    .join(' | ')

  return monthsStr
}

const ReviewSummary = ({ reviews }) => {
  const { t } = useTranslation()
  const summary = createReviewSummary(reviews)
  const stats = []

  if (summary.quality.average !== null) {
    stats.push(
      <span key="quality">
        {t('glossary.quality')} {getStarRating(summary.quality.average)} (
        {summary.quality.count})
      </span>,
    )
  }

  if (summary.yield.average !== null) {
    stats.push(
      <span key="yield">
        {t('glossary.yield')} {getStarRating(summary.yield.average)} (
        {summary.yield.count})
      </span>,
    )
  }

  const flowers = formatMonthList(summary.fruiting.flowers)
  if (flowers) {
    stats.push(
      <span key="flowers">
        {t('locations.infowindow.fruiting.0')} – {flowers}
      </span>,
    )
  }

  const unripe = formatMonthList(summary.fruiting.unripe)
  if (unripe) {
    stats.push(
      <span key="unripe">
        {t('locations.infowindow.fruiting.1')} – {unripe}
      </span>,
    )
  }

  const ripe = formatMonthList(summary.fruiting.ripe)
  if (ripe) {
    stats.push(
      <span key="ripe">
        {t('locations.infowindow.fruiting.2')} – {ripe}
      </span>,
    )
  }

  if (stats.length === 0) {
    return null
  }

  return (
    <ReviewStats>
      <StatsRow>
        {[stats[0], stats[1]].filter(Boolean).map((stat, i) => (
          <>
            {i > 0 && <Separator />}
            {stat}
          </>
        ))}
      </StatsRow>
      <StatsRow>
        {stats.slice(2).map((stat, i) => (
          <>
            {i > 0 && <Separator />}
            {stat}
          </>
        ))}
      </StatsRow>
    </ReviewStats>
  )
}

export default ReviewSummary
