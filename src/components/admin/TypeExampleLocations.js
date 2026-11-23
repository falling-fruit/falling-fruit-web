import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { MIN_LOCATION_ZOOM } from '../../constants/map'
import { getLocations } from '../../utils/api'
import { viewToString } from '../../utils/appUrl'
import LocationDisplay from '../ui/LocationDisplay'
import { typeStrings } from './typeStrings'
import { Muted, Section, SectionTitle } from './typeStyles'
import { WORLD_BOUNDS } from './typeUtils'

const EXAMPLE_COUNT = 5

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding-block: 0.2em;
  }
`

const TypeExampleLocations = ({ typeId, count }) => {
  const [locations, setLocations] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCancelled = false
    if (count === 0) {
      setLocations([])
      return undefined
    }
    getLocations({
      types: String(typeId),
      bounds: WORLD_BOUNDS,
      limit: EXAMPLE_COUNT,
    })
      .then((result) => !isCancelled && setLocations(result))
      .catch((fetchError) => !isCancelled && setError(fetchError.message))
    return () => {
      isCancelled = true
    }
  }, [typeId, count])

  return (
    <Section>
      <SectionTitle>{typeStrings.examples.title}</SectionTitle>
      {error ? (
        <Muted>{typeStrings.examples.loadFailed(error)}</Muted>
      ) : locations && locations.length === 0 ? (
        <Muted>{typeStrings.examples.none}</Muted>
      ) : (
        <List>
          {(locations ?? []).map((location) => (
            <li key={location.id}>
              <Link
                to={`/locations/${location.id}/${viewToString(location.lat, location.lng, MIN_LOCATION_ZOOM)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LocationDisplay location={location} />
              </Link>
            </li>
          ))}
        </List>
      )}
    </Section>
  )
}

export default TypeExampleLocations
