import { useRect } from '@reach/rect'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import { useFilteredParams } from '../../utils/useFilteredParams'
import InfiniteList from '../list/InfiniteList'
import { NoResultsFound, ShouldZoomIn } from '../list/ListLoading'
import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../map/MapPage'

const MOBILE_LIST_LOAD_LIMIT = 30

const ListPageContainer = styled.div`
  height: 100%;
`

const ListPage = () => {
  const { pathname } = useLocation()
  const { view } = useMap()
  const getFilteredParams = useFilteredParams()

  const [locations, setLocations] = useState([])
  const [hasMoreItems, setHasMoreItems] = useState(false)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)

  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }

  const loadNextPage = useCallback(
    async (offset) => {
      setIsNextPageLoading(true)
      const locationResults = await getLocations(
        getFilteredParams({ limit: MOBILE_LIST_LOAD_LIMIT, offset }, true),
      )
      setIsNextPageLoading(false)

      setLocations((locations) => {
        setHasMoreItems(locations.length !== 0)
        return [...locations, ...locationResults]
      })
    },
    [getFilteredParams],
  )

  useEffect(() => {
    const { bounds, zoom } = view
    if (
      bounds?.ne.lat != null &&
      zoom > VISIBLE_CLUSTER_ZOOM_LIMIT &&
      pathname === '/list'
    ) {
      // TODO: would be nice to get both here, or perhaps a bool of whether there is more
      loadNextPage(0)
    } else {
      setLocations([])
    }
  }, [view, pathname, loadNextPage])

  let content
  if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
    content = <ShouldZoomIn />
  } else if (locations.length === 0) {
    content = <NoResultsFound />
  } else {
    content = (
      <InfiniteList
        width={rect.width}
        height={rect.height}
        locations={locations}
        loadNextPage={() => loadNextPage(locations.length)}
        hasMoreItems={hasMoreItems}
        isNextPageLoading={isNextPageLoading}
      />
    )
  }

  return <ListPageContainer ref={container}>{content}</ListPageContainer>
}

export default ListPage
