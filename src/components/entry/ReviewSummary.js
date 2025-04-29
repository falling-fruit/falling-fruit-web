import React from 'react'
import { useTranslation } from 'react-i18next'

import { createReviewSummary } from '../../utils/createReviewSummary'
import ReviewStats, { getStarRating, Separator, StatsRow } from './ReviewStats'
import { formatMonthList } from './textFormatters'

const ReviewSummary = ({ reviews }) => {
  const { i18n, t } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const summary = createReviewSummary(reviews)
  const stats = []

  if (summary.quality.average !== null) {
    stats.push(
      <span key="quality">
        {t('glossary.quality')} {getStarRating(summary.quality.average, isRTL)}{' '}
        ({summary.quality.count})
      </span>,
    )
  }

  if (summary.yield.average !== null) {
    stats.push(
      <span key="yield">
        {t('glossary.yield')} {getStarRating(summary.yield.average, isRTL)} (
        {summary.yield.count})
      </span>,
    )
  }

  const flowers = formatMonthList(summary.fruiting.flowers, i18n.language)
  if (flowers) {
    stats.push(
      <span key="flowers">
        {t('locations.infowindow.fruiting.0')} – {flowers}
      </span>,
    )
  }

  const unripe = formatMonthList(summary.fruiting.unripe, i18n.language)
  if (unripe) {
    stats.push(
      <span key="unripe">
        {t('locations.infowindow.fruiting.1')} – {unripe}
      </span>,
    )
  }

  const ripe = formatMonthList(summary.fruiting.ripe, i18n.language)
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
          <React.Fragment key={`top-stat-${i}`}>
            {i > 0 && <Separator />}
            {stat}
          </React.Fragment>
        ))}
      </StatsRow>
      <StatsRow>
        {stats.slice(2).map((stat, i) => (
          <React.Fragment key={`bottom-stat-${i}`}>
            {i > 0 && <Separator />}
            {stat}
          </React.Fragment>
        ))}
      </StatsRow>
    </ReviewStats>
  )
}

export default ReviewSummary
