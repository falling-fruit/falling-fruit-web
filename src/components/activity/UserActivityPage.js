import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  getUserActivity,
  resetLastBrowsedSection,
} from '../../redux/activitySlice'
import {
  calculateCityCountsFromChanges,
  calculateTypeCountsFromChanges,
} from '../../utils/activityTypeCounts'
import { transformActivityData } from '../../utils/transformActivityData'
import { useAppHistory } from '../../utils/useAppHistory'
import BackButton from '../ui/BackButton'
import { Page } from '../ui/PageTemplate'
import ReturnIcon from '../ui/ReturnIcon'
import ActivitySearchInput from './ActivitySearchInput'
import ChangesPeriod from './ChangesPeriod'
import SkeletonLoader from './SkeletonLoader'

const UserActivityDisplay = ({ changes, userId, typesAccess }) => {
  const { t, i18n } = useTranslation()
  const { lastBrowsedSection } = useSelector((state) => state.activity)
  const [searchTerm, setSearchTerm] = useState(
    lastBrowsedSection.searchTerm || '',
  )
  const loadMoreRef = useRef()
  const [displayLimit, setDisplayLimit] = useState(
    lastBrowsedSection.displayLimit || 100,
  )

  const needsLoadMore = changes?.length > displayLimit

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayLimit((x) => x + 20)
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
  }, [needsLoadMore, displayLimit])

  const typeCountsById = changes
    ? calculateTypeCountsFromChanges(changes, typesAccess)
    : []

  const cityCounts = changes ? calculateCityCountsFromChanges(changes) : []
  const transformedData = useMemo(
    () => transformActivityData(changes || [], typesAccess, t, i18n.language),
    [changes, typesAccess, t, i18n.language],
  )

  return (
    <>
      <ActivitySearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm('')}
        typesAccess={typesAccess}
        typeCountsById={typeCountsById}
        cityCounts={cityCounts}
      />
      {transformedData.slice(0, displayLimit).map((period) => (
        <ChangesPeriod
          key={period.formattedDate}
          period={period}
          userId={userId}
          searchTerm={searchTerm}
          displayLimit={displayLimit}
        />
      ))}

      {needsLoadMore && <div ref={loadMoreRef}></div>}
    </>
  )
}

const StyledBackButton = styled(BackButton)`
  margin-bottom: 23px;
  svg {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.6em;
  }
`

const UserActivityPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  let { userId } = useParams()
  userId = parseInt(userId)
  const history = useAppHistory()

  const { changesByUser, lastBrowsedSection } = useSelector(
    (state) => state.activity,
  )
  const changes = changesByUser[userId]

  const { t } = useTranslation()

  const { typesAccess } = useSelector((state) => state.type)

  const changesReady = !typesAccess.isEmpty

  const isCurrentUser = userId === user?.id

  useEffect(() => {
    if (lastBrowsedSection.id) {
      const periodElement = document.getElementById(`${lastBrowsedSection.id}`)
      if (periodElement && lastBrowsedSection.userId === userId) {
        periodElement.scrollIntoView()
      }
      dispatch(resetLastBrowsedSection())
    }
  }, [lastBrowsedSection, dispatch, userId])

  useEffect(() => {
    if (changesReady) {
      dispatch(getUserActivity(userId))
    }
  }, [dispatch, changesReady, userId])

  const userName = changes?.length > 0 ? changes[0].author : ''
  return (
    <Page>
      <StyledBackButton
        onClick={() =>
          history.push(isCurrentUser ? '/users/edit' : `/profiles/${userId}`)
        }
      >
        <ReturnIcon />
        {t('layouts.back')}
      </StyledBackButton>

      {changes !== undefined && changes.length > 0 && (
        <h2>
          {isCurrentUser ? (
            t('users.my_activity')
          ) : (
            <>
              {t('glossary.activity')}: {userName}
            </>
          )}
        </h2>
      )}
      {changes !== undefined &&
        (changes.length > 0 ? (
          <UserActivityDisplay
            changes={changes}
            userId={userId}
            typesAccess={typesAccess}
          />
        ) : (
          <p>
            {isCurrentUser
              ? t('pages.changes.my_activity_empty')
              : t('pages.changes.user_activity_empty')}
          </p>
        ))}
      {changes === undefined && <SkeletonLoader count={5} />}
    </Page>
  )
}

export default UserActivityPage
