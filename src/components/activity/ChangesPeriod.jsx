import { MapAlt as Map } from '@styled-icons/boxicons-regular'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { setLastBrowsedSection } from '../../redux/activitySlice'
import { viewToString } from '../../utils/appUrl'
import { tokenizeQuery as tokenize } from '../../utils/tokenize'
import { useIsDesktop } from '../../utils/useBreakpoint'

class SearchTerm {
  constructor(term) {
    this.term = term || ''
    this.tokenized = term ? tokenize(term) : ''
  }

  matches(text) {
    if (!this.term) {
      return true
    }
    if (!text) {
      return false
    }
    return tokenize(text).includes(this.tokenized)
  }

  matchesType(type) {
    return this.matches(type.commonName) || this.matches(type.scientificName)
  }
}

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

const LocationTypesList = ({ locations, onClickLink, searchTerm }) => {
  const search = new SearchTerm(searchTerm)

  return (
    <>
      {locations.map((loc, idx) => {
        // Check if the city matches the search term
        const cityMatchesSearch =
          searchTerm &&
          loc.coordinates &&
          loc.coordinates.city &&
          search.matches(loc.coordinates.city)

        // If city matches, all types should have high opacity
        const locationMatchesSearch = cityMatchesSearch

        const typeElements = loc.types.map((type, typeIdx) => {
          const typeMatchesSearch =
            !searchTerm || locationMatchesSearch || search.matchesType(type)

          const opacity = typeMatchesSearch ? 1 : 0.5

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
}

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

const ListItemInteraction = ({
  interactionType,
  locations,
  activity,
  onClickLink,
  hideAuthor,
  searchTerm,
}) => {
  if (locations.length === 0) {
    return null
  }

  const search = new SearchTerm(searchTerm)

  // Check if city matches search term
  const locationParts = [
    activity.location.city || '',
    activity.location.state || '',
    activity.location.country || '',
  ]
  const fullLocationName = locationParts.filter(Boolean).join(', ')

  const cityMatchesSearch = search.matches(fullLocationName)

  // Check if any location type matches search term
  const hasMatchingTypes =
    !searchTerm ||
    cityMatchesSearch ||
    locations.some((loc) => loc.types.some((type) => search.matchesType(type)))

  return (
    <p style={searchTerm && !hasMatchingTypes ? { opacity: 0.5 } : {}}>
      <LocationTypesList
        locations={locations}
        onClickLink={onClickLink}
        searchTerm={!hasMatchingTypes || cityMatchesSearch ? '' : searchTerm}
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
  )
}

const ChangesPeriod = ({ period, userId, searchTerm, displayLimit }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const onClickLink = useCallback(
    () =>
      dispatch(
        setLastBrowsedSection({
          id: period.formattedDate.toString(),
          userId: userId,
          searchTerm: searchTerm,
          displayLimit,
        }),
      ),
    [dispatch, period.formattedDate, userId, searchTerm, displayLimit],
  )

  // If userId is provided, we should hide the author in activity text
  const hideAuthor = !!userId

  // Check if any activity matches the search term
  const search = new SearchTerm(searchTerm)

  const hasMatchingActivities =
    !searchTerm ||
    period.activities.some((activity) => {
      // Check if location matches search term
      const locationParts = [
        activity.location.city || '',
        activity.location.state || '',
        activity.location.country || '',
      ]
      const fullLocationName = locationParts.filter(Boolean).join(', ')

      if (search.matches(fullLocationName)) {
        return true
      }

      // Check if any location type matches search term
      return ['added', 'edited', 'visited'].some((interactionType) =>
        activity[interactionType].some((loc) =>
          loc.types.some((type) => search.matchesType(type)),
        ),
      )
    })

  // If no activities match the search term, don't render this period
  if (searchTerm && !hasMatchingActivities) {
    return null
  }

  return (
    <div id={period.formattedDate}>
      <h3>{period.formattedDate}</h3>
      <ListChanges>
        {period.activities.map((activity, index) => (
          <ListItem key={index} isDesktop={isDesktop}>
            {['added', 'edited', 'visited'].map((interactionType) => (
              <ListItemInteraction
                key={interactionType}
                interactionType={interactionType}
                locations={activity[interactionType]}
                activity={activity}
                onClickLink={onClickLink}
                hideAuthor={hideAuthor}
                searchTerm={searchTerm}
              />
            ))}
          </ListItem>
        ))}
      </ListChanges>
    </div>
  )
}

export default ChangesPeriod
