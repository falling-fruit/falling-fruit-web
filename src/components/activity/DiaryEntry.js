import { MapAlt as Map } from '@styled-icons/boxicons-regular'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  setRecentChangesLastBrowsedSection,
  setUserActivityLastBrowsedSection,
} from '../../redux/activitySlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const formatChangeType = (type, t, isCurrentUser = false) => {
  // Create a composite key for the switch statement
  const key = `${type}+${isCurrentUser}`

  switch (key) {
    case 'added+true':
      return t('pages.changes.type.added_by_you')
    case 'edited+true':
      return t('pages.changes.type.edited_by_you')
    case 'visited+true':
      return t('pages.changes.type.visited_by_you')
    case 'added+false':
      return t('pages.changes.type.added')
    case 'edited+false':
      return t('pages.changes.type.edited')
    case 'visited+false':
      return t('pages.changes.type.visited')
    default:
      return `changes.type.${type}_${isCurrentUser}`
  }
}

export const AuthorLink = styled(Link)`
  color: ${({ theme }) => theme.blue} !important;
`

const LocationLink = styled(Link)`
  color: ${({ theme }) => theme.blue} !important;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const ScientificName = styled.span`
  font-style: italic;
`

const CommonName = styled.span`
  font-weight: bold;
`

const ListChanges = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const ListItem = styled.li`
  p {
    margin-block: 0 ${(props) => (props.isDesktop ? '0.5rem' : '1rem')};
    margin-inline: 0;
  }
`

const LocationTypesList = ({ locations, onClickLink }) => (
  <>
    {locations.map((loc, idx) => {
      const typeElements = loc.types.map((type, typeIdx) => {
        // Use the isSelected property that was set by ActivityDiaryFilter
        const opacity = loc.isSelected ? 1 : 0.5

        if (type.commonName) {
          return (
            <CommonName key={`common-${typeIdx}`} style={{ opacity }}>
              {type.commonName}
            </CommonName>
          )
        }
        if (type.scientificName) {
          return (
            <ScientificName key={`scientific-${typeIdx}`} style={{ opacity }}>
              {type.scientificName}
            </ScientificName>
          )
        }
        return null
      })

      const filteredTypes = typeElements.filter(Boolean)
      const typesWithSeparators = filteredTypes.reduce((prev, curr, idx) => {
        if (prev.length) {
          return [...prev, <span key={`separator-${idx}`}>, </span>, curr]
        }
        return [curr]
      }, [])
      return (
        <React.Fragment key={`${loc.locationId}-${idx}`}>
          <LocationLink to={loc.url} onClick={onClickLink}>
            {typesWithSeparators}
          </LocationLink>
          {idx < locations.length - 1 && <span> · </span>}
        </React.Fragment>
      )
    })}
  </>
)

const ActivityText = styled.span`
  color: ${({ theme }) => theme.secondaryText};
`

const ActivityTextComponent = ({
  place,
  author,
  authorUserId,
  interactionType,
  onClickLink,
  currentUserId,
}) => {
  const locationParts = [place.city, place.state, place.country]
  const hasLocationInfo = locationParts.filter(Boolean).length > 0
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const isCurrentUser = currentUserId && authorUserId === currentUserId

  const LocationDisplay = () => (
    <>
      {hasLocationInfo ? (
        locationParts.filter(Boolean).join(', ')
      ) : (
        <>
          <Map
            style={{ verticalAlign: 'sub', marginRight: '0.1em' }}
            size="1em"
          />
          {place.coordinatesGrid}
        </>
      )}
    </>
  )

  return (
    <ActivityText>
      {t('pages.changes.change_in_city', {
        type: formatChangeType(interactionType, t, isCurrentUser),
        city: '',
      })}
      {isRTL ? (
        <>
          {author && !isCurrentUser && (
            <>
              {authorUserId ? (
                <AuthorLink to={`/users/${authorUserId}`} onClick={onClickLink}>
                  {author}
                </AuthorLink>
              ) : (
                <span>{author}</span>
              )}
              {' — '}
            </>
          )}
          <LocationDisplay />
        </>
      ) : (
        <>
          <LocationDisplay />
          {author && !isCurrentUser && (
            <>
              {' — '}
              {authorUserId ? (
                <AuthorLink to={`/users/${authorUserId}`} onClick={onClickLink}>
                  {author}
                </AuthorLink>
              ) : (
                <span>{author}</span>
              )}
            </>
          )}
        </>
      )}
    </ActivityText>
  )
}

const ListItemInteraction = ({
  interactionType,
  locations,
  activity,
  onClickLink,
  hideAuthor,
  currentUserId,
}) => {
  if (locations.length === 0) {
    return null
  }

  return (
    <p>
      <LocationTypesList locations={locations} onClickLink={onClickLink} />{' '}
      <ActivityTextComponent
        place={activity.place}
        author={hideAuthor ? null : activity.author}
        authorUserId={hideAuthor ? null : activity.userId}
        interactionType={interactionType}
        onClickLink={onClickLink}
        currentUserId={currentUserId}
      />
    </p>
  )
}

const DiaryEntry = ({ entry, userId, displayLimit }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const { user } = useSelector((state) => state.auth)
  const currentUserId = user?.id

  const onClickLink = useCallback(() => {
    if (userId) {
      dispatch(
        setUserActivityLastBrowsedSection({
          id: entry.formattedDate.toString(),
          userId: userId,
          displayLimit,
        }),
      )
    } else {
      dispatch(
        setRecentChangesLastBrowsedSection({
          id: entry.formattedDate.toString(),
        }),
      )
    }
  }, [dispatch, entry.formattedDate, userId, displayLimit])

  return (
    <div id={entry.formattedDate}>
      <h3>{entry.formattedDate}</h3>
      <ListChanges>
        {entry.activities.map((activity, index) => (
          <ListItem key={index} isDesktop={isDesktop}>
            {['added', 'edited', 'visited'].map((interactionType) => (
              <ListItemInteraction
                key={interactionType}
                interactionType={interactionType}
                locations={activity[interactionType]}
                activity={activity}
                hideAuthor={!!userId}
                onClickLink={onClickLink}
                currentUserId={currentUserId}
              />
            ))}
          </ListItem>
        ))}
      </ListChanges>
    </div>
  )
}

export default DiaryEntry
