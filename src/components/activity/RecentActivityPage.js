import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchInitialLocationChanges,
  fetchLatestLocationChanges,
  fetchMoreLocationChanges,
  resetRecentChangesLastBrowsedSection,
} from '../../redux/activitySlice'
import { InfoPage } from '../ui/PageTemplate'
import { createActivityDiary } from './ActivityDiary'
import DiaryEntry from './DiaryEntry'
import SkeletonLoader from './SkeletonLoader'

const RecentActivityPage = () => {
  const dispatch = useDispatch()
  const loadMoreRef = useRef()
  const { t, i18n } = useTranslation()

  const { recentChanges } = useSelector((state) => state.activity)
  const { typesAccess } = useSelector((state) => state.type)

  const {
    data: changes,
    isLoading,
    isLoadingLatest,
    isStale,
    lastBrowsedSection,
  } = recentChanges

  const typesReady = !typesAccess.isEmpty
  const hasChanges = changes.length > 0

  // 1. Initial load: fetch the first page of changes once types are ready
  useEffect(() => {
    if (typesReady) {
      dispatch(fetchInitialLocationChanges())
    }
  }, [dispatch, typesReady])

  // 2. Return-to-page: either scroll to last browsed section, or fetch latest
  //    changes from the top if we came back via the main link.
  //    If the data is stale (e.g. a deletion just occurred), fetch latest first
  //    and defer any scroll-to-section until staleness is cleared.
  useEffect(() => {
    if (isStale) {
      dispatch(fetchInitialLocationChanges())
      return
    }

    if (lastBrowsedSection.id) {
      const periodElement = document.getElementById(`${lastBrowsedSection.id}`)
      if (periodElement) {
        periodElement.scrollIntoView()
      }
      dispatch(resetRecentChangesLastBrowsedSection())
    } else if (hasChanges) {
      dispatch(fetchLatestLocationChanges())
    }
  }, [lastBrowsedSection, isStale, dispatch]) //eslint-disable-line

  // 3. Scroll-to-bottom: fetch the next page of older changes
  useEffect(() => {
    if (!hasChanges) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchMoreLocationChanges())
        }
      },
      { threshold: 1.0 },
    )

    const currentRef = loadMoreRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [dispatch, hasChanges])

  const activityDiary = createActivityDiary(
    changes,
    typesAccess,
    t,
    i18n.language,
  )

  return (
    <InfoPage>
      <h1>{t('pages.changes.recent_activity')}</h1>
      {activityDiary.entries.length > 0 &&
        activityDiary.entries.map((entry, index) => (
          <DiaryEntry
            key={entry.formattedDate}
            entry={entry}
            isLoadingLatest={index === 0 && isLoadingLatest}
          />
        ))}
      <div ref={loadMoreRef}></div>
      {(changes.length === 0 || isLoading) && (
        <SkeletonLoader count={changes.length === 0 ? 5 : 1} />
      )}
    </InfoPage>
  )
}

export default RecentActivityPage
