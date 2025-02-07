import { Map } from '@styled-icons/boxicons-regular'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { setAnchorElementId } from '../../redux/activitySlice'
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

const AuthorLink = styled(Link)`
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
    margin: 0 0 ${(props) => (props.isDesktop ? '0.5rem' : '1rem')};
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
          <Map style={{ verticalAlign: 'text-top' }} size="1em" />
          {location.coordinatesGrid}
        </>
      )}
      {author && ' — '}
      {author && (
        <>
          {userId ? (
            <AuthorLink to={`/users/${userId}`} onClick={onClickLink}>
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

const formatPeriodName = (daysAgo, t) => {
  if (daysAgo === 0) {
    return t('time.last_24_hours')
  } else if (daysAgo === 1) {
    const time = t('time.days.one', { count: daysAgo })
    return t('time.time_ago', { time })
  } else {
    const time = t('time.days.other', { count: daysAgo })
    return t('time.time_ago', { time })
  }
}

const ChangesPeriod = ({ period }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const onClickLink = useCallback(
    () => dispatch(setAnchorElementId(period.daysAgo.toString())),
    [dispatch, period.daysAgo],
  )
  const { t } = useTranslation()

  return (
    <div id={period.daysAgo}>
      <h3>{formatPeriodName(period.daysAgo, t)}</h3>
      <ListChanges>
        {period.activities.map((activity, index) => (
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
