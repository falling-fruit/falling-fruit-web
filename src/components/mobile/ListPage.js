import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getLocations } from '../../utils/api'
import MapContext from '../map/MapContext'
import List from '../ui/List'

const LIMIT = 30

const ListPageContainer = styled.div`
  margin-top: 85px;
  height: calc(100% - 85px);
`

const ListPage = () => {
  const history = useHistory()
  const { view } = useContext(MapContext)
  const [locations, setLocations] = useState([])
  const [hasMoreItems, setHasMoreItems] = useState(false)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)

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
          limit: LIMIT,
        })
        setHasMoreItems(locations.length < locations[1])
        setLocations(locations.slice(2))
      }
    }
    fetchListEntries()
  }, [view])

  const loadNextPage = async () => {
    setIsNextPageLoading(true)
    const { bounds, center } = view
    const newLocations = await getLocations({
      swlng: bounds.sw.lng,
      nelng: bounds.ne.lng,
      swlat: bounds.sw.lat,
      nelat: bounds.ne.lat,
      lng: center.lng,
      lat: center.lat,
      limit: LIMIT,
      offset: locations.length,
    })
    setHasMoreItems(newLocations[0] === 0)
    setLocations([...locations].concat(newLocations.slice(2)))
    setIsNextPageLoading(false)
  }

  const handleListEntryClick = (id) => {
    history.push({
      pathname: `/entry/${id}`,
      state: { fromPage: '/map' },
    })
  }

  return (
    <ListPageContainer>
      <List
        locations={locations}
        loadNextPage={loadNextPage}
        handleListEntryClick={handleListEntryClick}
        hasMoreItems={hasMoreItems}
        isNextPageLoading={isNextPageLoading}
      />
    </ListPageContainer>
  )
}

export default ListPage