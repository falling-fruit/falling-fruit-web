import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocations } from '../../utils/api'
import MapContext from '../map/MapContext'
import List from '../ui/List'

const ListPageContainer = styled.div`
  margin-top: 85px;
  height: 100%;
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
      <List locations={locations} handleListEntryClick={handleListEntryClick} />
    </ListPageContainer>
  )
}

export default ListPage
