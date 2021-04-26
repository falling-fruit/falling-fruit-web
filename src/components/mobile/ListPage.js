import { useRect } from '@reach/rect'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import InfiniteList from '../list/InfiniteList'

// TODO: Ask Jeffrey what the limit for mobile list view should be
const LIMIT = 30

const ListPageContainer = styled.div`
  margin-top: 85px;
  height: 100%;
`

const ListPage = () => {
  const { view } = useMap()
  const [locations, setLocations] = useState([])
  const [hasMoreItems, setHasMoreItems] = useState(false)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)

  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }

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
        setHasMoreItems(locations[0] < locations[1])
        setLocations(locations.slice(2))
      } else {
        setLocations([])
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
    setHasMoreItems(newLocations[0] !== 0)
    setLocations([...locations].concat(newLocations.slice(2)))
    setIsNextPageLoading(false)
  }

  return (
    <ListPageContainer ref={container}>
      <InfiniteList
        width={rect.width}
        height={rect.height}
        locations={locations}
        loadNextPage={loadNextPage}
        hasMoreItems={hasMoreItems}
        isNextPageLoading={isNextPageLoading}
      />
    </ListPageContainer>
  )
}

export default ListPage
