import { Map } from '@styled-icons/boxicons-regular'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { theme } from './GlobalStyle'
import { CommonOrScientificName } from './TypeName'

const Address = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.85rem;
`

export const getLocationPlainName = (location, typesAccess) => {
  const names = (location.type_ids || []).map((typeId) => {
    const type = typesAccess.getType(typeId)
    const components = type?.displayComponents()
    if (!components) {
      return typeId
    }
    const { common, scientific, cultivar } = components
    if (common) {
      return common
    }
    const scientificName = [scientific, cultivar].filter(Boolean).join(' ')
    return scientificName || typeId
  })
  return names.length > 0 ? names.join(', ') : String(location.id)
}

export const LocationTypeNames = ({ location }) => {
  const { typesAccess } = useSelector((state) => state.type)
  const typeIds = location.type_ids || []

  if (typeIds.length === 0) {
    return <span>{String(location.id)}</span>
  }

  const typeElements = typeIds.map((typeId) => {
    const type = typesAccess.getType(typeId)
    const components = type?.displayComponents()
    if (!components || (!components.common && !components.scientific)) {
      return <span key={typeId}>{typeId}</span>
    }
    return <CommonOrScientificName key={typeId} type={type} />
  })

  return (
    <>
      {typeElements.reduce((prev, curr, idx) => {
        if (prev.length) {
          return [...prev, <span key={`sep-${idx}`}>, </span>, curr]
        }
        return [curr]
      }, [])}
    </>
  )
}

export const LocationAddress = ({ location }) => {
  if (location.address) {
    return <Address>{location.address}</Address>
  }
  if (location.lat != null && location.lng != null) {
    return (
      <Address>
        <Map color={theme.secondaryText} size={16} />
        {`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
      </Address>
    )
  }
  return null
}

const LocationDisplay = ({ location }) => (
  <>
    <LocationTypeNames location={location} />{' '}
    <LocationAddress location={location} />
  </>
)

export default LocationDisplay
