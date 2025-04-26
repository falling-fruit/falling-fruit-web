import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchMoreLocationChanges,
  resetLastBrowsedSection,
} from '../../redux/activitySlice'
import { transformActivityData } from '../../utils/transformActivityData'
import { InfoPage } from '../ui/PageTemplate'
import ChangesPeriod from './ChangesPeriod'
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
  const { lastBrowsedSection } = useSelector((state) => state.activity)

  const changesReady = !typesAccess.isEmpty

  useEffect(() => {
    if (lastBrowsedSection.id) {
      const periodElement = document.getElementById(`${lastBrowsedSection.id}`)
      if (periodElement && !lastBrowsedSection.userId) {
        periodElement.scrollIntoView()
      }
      dispatch(resetLastBrowsedSection())
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
  const groupedData = transformActivityData(
    changes,
    typesAccess,
    t,
    i18n.language,
  )

  return (
    <InfoPage>
      <h1>{t('pages.changes.recent_changes')}</h1>
      {changes.length > 0 &&
        groupedData.map((period) => (
          <ChangesPeriod
            key={period.formattedDate}
            period={period}
            typesAccess={typesAccess}
          />
        ))}
      <div ref={loadMoreRef}></div>
      {isLoading && <SkeletonLoader count={changes.length === 0 ? 5 : 1} />}
    </InfoPage>
  )
}

export default RecentChangesPage
