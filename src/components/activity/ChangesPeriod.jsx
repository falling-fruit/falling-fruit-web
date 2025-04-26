import { MapAlt as Map } from '@styled-icons/boxicons-regular'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { setLastBrowsedSection } from '../../redux/activitySlice'
import { viewToString } from '../../utils/appUrl'
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
        if (type.commonName) {
          return (
            <CommonName key={`common-${typeIdx}`}>{type.commonName}</CommonName>
          )
        }
        if (type.scientificName) {
          return (
            <ScientificName key={`scientific-${typeIdx}`}>
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
          <LocationLink
            to={`/locations/${loc.locationId}/${viewToString(
              loc.coordinates.latitude,
              loc.coordinates.longitude,
              MIN_LOCATION_ZOOM,
            )}`}
            onClick={onClickLink}
          >
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
  location,
  author,
  userId,
  interactionType,
  onClickLink,
  hideAuthor,
}) => {
  const locationParts = [location.city, location.state, location.country]
  const hasLocationInfo = locationParts.filter(Boolean).length > 0
  const { t } = useTranslation()

  return (
    <ActivityText>
      {t('pages.changes.change_in_city', {
        type: formatChangeType(interactionType, t),
        city: '',
      })}
      {hasLocationInfo ? (
        locationParts.filter(Boolean).join(', ')
      ) : (
        <>
          <Map
            style={{ verticalAlign: 'sub', marginRight: '0.1em' }}
            size="1em"
          />
          {location.coordinatesGrid}
        </>
      )}
      {!hideAuthor && author && ' — '}
      {!hideAuthor && author && (
        <>
          {userId ? (
            <AuthorLink to={`/profiles/${userId}`} onClick={onClickLink}>
              {author}
            </AuthorLink>
          ) : (
            author
          )}
        </>
      )}
    </ActivityText>
  )
}

const ChangesPeriod = ({ period, userId, searchTerm }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const onClickLink = useCallback(
    () =>
      dispatch(
        setLastBrowsedSection({
          id: period.formattedDate.toString(),
          userId: userId,
        }),
      ),
    [dispatch, period.formattedDate, userId],
  )

  // If userId is provided, we should hide the author in activity text
  const hideAuthor = !!userId

  // Filter activities based on searchTerm
  const filteredActivities = period.activities
    .map((activity) => {
      if (!searchTerm) {
        return activity
      }

      const searchLower = searchTerm.toLowerCase()

      // Check if location matches search term
      const locationParts = [
        activity.location.city || '',
        activity.location.state || '',
        activity.location.country || '',
      ]
      const fullLocationName = locationParts
        .filter(Boolean)
        .join(', ')
        .toLowerCase()
      const locationMatches = fullLocationName.includes(searchLower)

      // Filter locations in each interaction type
      const filteredActivity = {
        ...activity,
        added: filterLocations(activity.added, searchLower),
        edited: filterLocations(activity.edited, searchLower),
        visited: filterLocations(activity.visited, searchLower),
      }

      // If location matches, keep all locations
      if (locationMatches) {
        return activity
      }

      // If any locations remain after filtering, return the filtered activity
      if (
        filteredActivity.added.length > 0 ||
        filteredActivity.edited.length > 0 ||
        filteredActivity.visited.length > 0
      ) {
        return filteredActivity
      }

      // No matches, return null to filter out this activity
      return null
    })
    .filter(Boolean)

  // Helper function to filter locations based on search term
  function filterLocations(locations, searchLower) {
    if (!searchLower) {
      return locations
    }

    return locations.filter((loc) => loc.types.some((type) =>
        (type.commonName || type.scientificName || '')
          .toLowerCase()
          .includes(searchLower),
      ))
  }

  // If no activities match the search term, don't render this period
  if (filteredActivities.length === 0) {
    return null
  }

  return (
    <div id={period.formattedDate}>
      <h3>{period.formattedDate}</h3>
      <ListChanges>
        {filteredActivities.map((activity, index) => (
          <ListItem key={index} isDesktop={isDesktop}>
            {['added', 'edited', 'visited'].map((interactionType) => {
              const locations = activity[interactionType]
              return locations.length > 0 ? (
                <p key={interactionType}>
                  <LocationTypesList
                    locations={locations}
                    onClickLink={onClickLink}
                  />{' '}
                  <ActivityTextComponent
                    location={activity.location}
                    coordinates={activity.coordinates}
                    author={activity.author}
                    userId={activity.userId}
                    interactionType={interactionType}
                    onClickLink={onClickLink}
                    hideAuthor={hideAuthor}
                  />
                </p>
              ) : null
            })}
          </ListItem>
        ))}
      </ListChanges>
    </div>
  )
}

export default ChangesPeriod
