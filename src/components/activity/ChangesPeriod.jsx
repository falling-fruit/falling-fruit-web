import { Map } from '@styled-icons/boxicons-regular'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { setAnchorElementId } from '../../redux/activitySlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

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
            to={`/locations/${loc.locationId}`}
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
  coordinates,
  author,
  userId,
  type,
  onClickLink,
}) => {
  const locationParts = [location.city, location.state, location.country]
  const hasLocationInfo = locationParts.filter(Boolean).length > 0
  const hasCoordinates = coordinates.latitude && coordinates.longitude

  return (
    <ActivityText>
      {type} in{' '}
      {hasLocationInfo
        ? locationParts.filter(Boolean).join(', ')
        : hasCoordinates && (
            <>
              <Map size="1em" />
              {` ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(
                4,
              )}`}
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

const ChangesPeriod = ({ period }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const onClickLink = useCallback(
    () => dispatch(setAnchorElementId(period.periodName)),
    [dispatch, period.periodName],
  )
  return (
    <div id={period.periodName}>
      <h3>{period.periodName}</h3>
      <ListChanges>
        {period.activities.map((activity, index) => (
          <ListItem key={index} isDesktop={isDesktop}>
            {['added', 'edited', 'visited'].map((type) => {
              const locations = activity[type]
              return locations.length > 0 ? (
                <p key={type}>
                  <LocationTypesList
                    locations={locations}
                    onClickLink={onClickLink}
                  />{' '}
                  <ActivityTextComponent
                    location={activity.location}
                    coordinates={activity.coordinates}
                    author={activity.author}
                    userId={activity.userId}
                    type={type}
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
