import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchMoreLocationChanges,
  resetRecentChangesLastBrowsedSection,
} from '../../redux/activitySlice'
import { InfoPage } from '../ui/PageTemplate'
import { createActivityDiary } from './ActivityDiary'
import DiaryEntry from './DiaryEntry'
import SkeletonLoader from './SkeletonLoader'

const RecentChangesPage = () => {
  const dispatch = useDispatch()
  const loadMoreRef = useRef()
  const { t } = useTranslation()

  const changes = useSelector((state) => state.activity.recentChanges.data)
  const isLoading = useSelector(
    (state) => state.activity.recentChanges.isLoading,
  )

  const { typesAccess } = useSelector((state) => state.type)
  const { recentChanges } = useSelector((state) => state.activity)
  const { lastBrowsedSection } = recentChanges

  const changesReady = !typesAccess.isEmpty

  useEffect(() => {
    if (lastBrowsedSection.id) {
      const periodElement = document.getElementById(`${lastBrowsedSection.id}`)
      if (periodElement) {
        periodElement.scrollIntoView()
      }
      dispatch(resetRecentChangesLastBrowsedSection())
    }
  }, [lastBrowsedSection, dispatch])

  useEffect(() => {
    if (changesReady) {
      dispatch(fetchMoreLocationChanges())
    }
  }, [dispatch, changesReady])

  useEffect(() => {
    if (changesReady) {
      // Store the necessary state values in refs to avoid using hooks in callbacks
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
    }
  }, [dispatch, changesReady])

  const { i18n } = useTranslation()
  const activityDiary = createActivityDiary(
    changes,
    typesAccess,
    t,
    i18n.language,
  )

  return (
    <InfoPage>
      <h1>{t('pages.changes.activity_recent_changes')}</h1>
      {activityDiary.entries.length > 0 &&
        activityDiary.entries.map((entry) => (
          <DiaryEntry key={entry.formattedDate} entry={entry} />
        ))}
      <div ref={loadMoreRef}></div>
      {isLoading && <SkeletonLoader count={changes.length === 0 ? 5 : 1} />}
    </InfoPage>
  )
}

export default RecentChangesPage
