import { useRect } from '@reach/rect'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import InfiniteList from '../list/InfiniteList'
import { NoResultsFound, ShouldZoomIn } from '../list/ListLoading'
// TODO: Ask Jeffrey what the limit for mobile list view should be
const LIMIT = 30

const ListPageContainer = styled.div`
  height: 100%;
`

const ListPage = () => {
  const { pathname } = useLocation()
  const { view } = useMap()
  const [locations, setLocations] = useState([])
  const [hasMoreItems, setHasMoreItems] = useState(false)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)

  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }

  const fetchListEntries = async (bounds, center, offset) => {
    // TODO: Include filters by consolidating all getLocations API calls
    const locations = await getLocations({
      swlng: bounds.sw.lng,
      nelng: bounds.ne.lng,
      swlat: bounds.sw.lat,
      nelat: bounds.ne.lat,
      lng: center.lng,
      lat: center.lat,
      limit: LIMIT,
      offset,
    })
    return locations
  }

  useEffect(() => {
    const fetchInitialListEntries = async () => {
      const { bounds, zoom, center } = view
      if (bounds?.ne.lat != null && zoom > 12 && pathname === '/list') {
        const locations = await fetchListEntries(bounds, center, 0)
        setHasMoreItems(locations[0] < locations[1])
        setLocations(locations.slice(2))
      } else {
        setLocations([])
      }
    }
    fetchInitialListEntries()
  }, [view, pathname])

  useEffect(() => {
    const fetchInitialListEntries = async () => {
      const { bounds, zoom, center } = view
      if (bounds?.ne.lat != null && zoom > 12 && pathname === 'list') {
        console.log('HERE: ', pathname)
        const locations = await fetchListEntries(bounds, center, 0)
        setHasMoreItems(locations[0] < locations[1])
        setLocations(locations.slice(2))
      } else {
        setLocations([])
      }
    }
    fetchInitialListEntries()
  }, [view, pathname])

  const loadNextPage = async () => {
    setIsNextPageLoading(true)
    const { bounds, center } = view
    const newLocations = await fetchListEntries(
      bounds,
      center,
      locations.length,
    )
    setIsNextPageLoading(false)
    setHasMoreItems(newLocations[0] !== 0)
    setLocations((locations) => [...locations, ...newLocations.slice(2)])
  }

  let content
  if (view.zoom <= 12) {
    content = <ShouldZoomIn />
  } else if (locations.length === 0) {
    content = <NoResultsFound />
  } else {
    content = (
      <InfiniteList
        width={rect.width}
        height={rect.height}
        locations={locations}
        loadNextPage={loadNextPage}
        hasMoreItems={hasMoreItems}
        isNextPageLoading={isNextPageLoading}
      />
    )
  }

  return <ListPageContainer ref={container}>{content}</ListPageContainer>
}

export default ListPage
