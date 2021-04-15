import { ChevronRight, Star } from '@styled-icons/boxicons-solid'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocations } from '../../utils/api'
import MapContext from '../map/MapContext'
import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'

const convertMetersToMiles = (meters) => {
  let miles = (meters * 0.000621371192).toString()
  miles = miles.slice(0, miles.indexOf('.') + 3)
  return miles
}

const ListPageContainer = styled.div`
  margin-top: 85px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
  }
`

const ListPage = () => {
  const history = useHistory()
  const { view } = useContext(MapContext)
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchListEntries = async () => {
      const { bounds, zoom, center } = view
      if (bounds?.ne.lat != null && zoom > 12) {
        const locations = await getLocations({
          swlng: bounds.sw.lng,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          lng: center.lng,
          lat: center.lat,
        })
        setLocations(locations.slice(2))
      }
    }
    fetchListEntries()
  }, [view])

  const handleListEntryClick = (id) => {
    history.push({
      pathname: `/entry/${id}`,
      state: { fromPage: '/map' },
    })
  }

  return (
    <ListPageContainer>
      {locations.map((location) => (
        <ListEntry
          key={location.id}
          leftIcons={<Star size="16" />}
          rightIcons={<ChevronRight size="16" color={theme.blue} />}
          primaryText={location.type_names[0]}
          secondaryText={`${convertMetersToMiles(location.distance)} miles`}
          onClick={handleListEntryClick(location.id)}
        />
      ))}
    </ListPageContainer>
  )
}

export default ListPage
