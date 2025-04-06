import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import {
  fetchMoreLocationChanges,
  setAnchorElementId,
} from '../../redux/activitySlice'
import { transformActivityData } from '../../utils/transformActivityData'
import { InfoPage } from '../ui/PageTemplate'
import ChangesPeriod from './ChangesPeriod'

const SkeletonWrapper = styled.div`
  margin-bottom: 16px;
`

const SkeletonGroup = styled.div`
  margin-bottom: 20px;
`

const SkeletonLoader = ({ count = 3 }) => (
  <SkeletonWrapper>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonGroup key={index}>
        <Skeleton width="40%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="55%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="70%" height={20} />
      </SkeletonGroup>
    ))}
  </SkeletonWrapper>
)

const ActivityPage = () => {
  const dispatch = useDispatch()

  const loadMoreRef = useRef()
  const { t } = useTranslation()

  const { typesAccess } = useSelector((state) => state.type)
  const { locationChanges, isLoading } = useSelector((state) => state.activity)
  const { anchorElementId } = useSelector((state) => state.activity)

  const changesReady = !typesAccess.isEmpty

  useEffect(() => {
    if (anchorElementId) {
      const periodElement = document.getElementById(`${anchorElementId}`)
      if (periodElement) {
        periodElement.scrollIntoView()
        dispatch(setAnchorElementId(null))
      }
    }
  }, [anchorElementId, dispatch])

  useEffect(() => {
    if (changesReady) {
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

  const groupedData = transformActivityData(locationChanges, typesAccess)

  return (
    <InfoPage>
      <h1>{t('pages.changes.recent_changes')}</h1>
      {locationChanges.length > 0 &&
        groupedData.map((period) => (
          <ChangesPeriod key={period.daysAgo} period={period} />
        ))}
      <div ref={loadMoreRef}></div>
      {isLoading && (
        <SkeletonLoader count={locationChanges.length === 0 ? 5 : 1} />
      )}
    </InfoPage>
  )
}

export default ActivityPage
