import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import {
  getUserActivity,
  resetUserActivityLastBrowsedSection,
} from '../../redux/activitySlice'
import { useAppHistory } from '../../utils/useAppHistory'
import BackButton from '../ui/BackButton'
import { Page } from '../ui/PageTemplate'
import ReturnIcon from '../ui/ReturnIcon'
import { createActivityDiary } from './ActivityDiary'
import DiaryEntry from './DiaryEntry'
import SkeletonLoader from './SkeletonLoader'
import TypesAndPlaces from './TypesAndPlaces'

const AtLeastAsLongAsSelectMenu = styled.div`
  min-height: 300px;
`

const UserActivityDisplay = ({ changes, userId, typesAccess }) => {
  const { t, i18n } = useTranslation()
  const { userActivityLastBrowsedSection } = useSelector(
    (state) => state.activity,
  )
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const loadMoreRef = useRef()
  const [displayLimit, setDisplayLimit] = useState(
    userActivityLastBrowsedSection.displayLimit || 100,
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

  const activityDiary = useMemo(
    () => createActivityDiary(changes || [], typesAccess, t, i18n.language),
    [changes, typesAccess, t, i18n.language],
  )

  // Get filtered entries from the activity diary
  const filteredEntries = useMemo(
    () => activityDiary.getFilteredEntries(selectedTypes, selectedPlaces),
    [activityDiary, selectedTypes, selectedPlaces],
  )

  return (
    <>
      <TypesAndPlaces
        typeCounts={activityDiary.calculateTypeCounts(selectedPlaces)}
        cityCounts={activityDiary.calculateCityCounts(selectedTypes)}
        selectedTypes={selectedTypes}
        selectedPlaces={selectedPlaces}
        onTypeChange={setSelectedTypes}
        onPlaceChange={setSelectedPlaces}
      />
      <AtLeastAsLongAsSelectMenu>
        {filteredEntries.slice(0, displayLimit).map((entry) => (
          <DiaryEntry
            key={entry.formattedDate}
            entry={entry}
            userId={userId}
            displayLimit={displayLimit}
          />
        ))}
      </AtLeastAsLongAsSelectMenu>

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

  const { changesByUser, userActivityLastBrowsedSection } = useSelector(
    (state) => state.activity,
  )
  const changes = changesByUser[userId]

  const { t } = useTranslation()

  const { typesAccess } = useSelector((state) => state.type)

  const changesReady = !typesAccess.isEmpty

  const isCurrentUser = userId === user?.id

  useEffect(() => {
    if (userActivityLastBrowsedSection.id) {
      const periodElement = document.getElementById(
        `${userActivityLastBrowsedSection.id}`,
      )
      if (periodElement && userActivityLastBrowsedSection.userId === userId) {
        periodElement.scrollIntoView()
      }
      dispatch(resetUserActivityLastBrowsedSection())
    }
  }, [userActivityLastBrowsedSection, dispatch, userId])

  useEffect(() => {
    if (changesReady) {
      dispatch(getUserActivity(userId)).then((action) => {
        if (action.error) {
          history.push('/map')
          toast.error(
            t('error_message.api.fetch_location_changes_failed', {
              message: action.error.message || t('error_message.unknown_error'),
            }),
          )
        }
      })
    }
  }, [dispatch, changesReady, userId]) //eslint-disable-line

  const userName = changes?.length > 0 ? changes[0].author : ''
  return (
    <Page>
      <StyledBackButton
        onClick={() =>
          history.push(isCurrentUser ? '/account/edit' : `/users/${userId}`)
        }
      >
        <ReturnIcon />
        {t('layouts.back')}
      </StyledBackButton>

      {changes !== undefined && changes.length > 0 && (
        <h2>
          {isCurrentUser ? (
            t('users.your_activity')
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
              ? t('pages.changes.your_activity_empty')
              : t('pages.changes.user_activity_empty')}
          </p>
        ))}
      {changes === undefined && <SkeletonLoader count={5} />}
    </Page>
  )
}

export default UserActivityPage
