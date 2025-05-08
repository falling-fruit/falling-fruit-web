import { MapAlt as Map } from '@styled-icons/boxicons-regular'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  setRecentChangesLastBrowsedSection,
  setUserActivityLastBrowsedSection,
} from '../../redux/activitySlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const formatChangeType = (type, t) => {
  switch (type) {
    case 'added':
      return t('pages.changes.type.added')
    case 'edited':
      return t('pages.changes.type.edited')
    case 'visited':
      return t('pages.changes.type.visited')
    default:
      return `changes.type.${type}`
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
}) => {
  const locationParts = [place.city, place.state, place.country]
  const hasLocationInfo = locationParts.filter(Boolean).length > 0
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

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

  const AuthorDisplay = () => (
    <>
      {author && (
        <>
          {authorUserId ? (
            <AuthorLink to={`/profiles/${authorUserId}`} onClick={onClickLink}>
              {author}
            </AuthorLink>
          ) : (
            author
          )}
        </>
      )}
    </>
  )

  return (
    <ActivityText>
      {t('pages.changes.change_in_city', {
        type: formatChangeType(interactionType, t),
        city: '',
      })}
      {isRTL ? (
        <>
          {author && <AuthorDisplay />}
          {author && ' — '}
          <LocationDisplay />
        </>
      ) : (
        <>
          <LocationDisplay />
          {author && ' — '}
          {author && <AuthorDisplay />}
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
      />
    </p>
  )
}

const DiaryEntry = ({ entry, userId, displayLimit }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
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
              />
            ))}
          </ListItem>
        ))}
      </ListChanges>
    </div>
  )
}

export default DiaryEntry
