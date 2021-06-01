import { useRect } from '@reach/rect'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-use'
import styled from 'styled-components/macro'

import { fetchListLocations } from '../../redux/listSlice'
import InfiniteList from '../list/InfiniteList'
import { NoResultsFound, ShouldZoomIn } from '../list/ListLoading'
import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../map/MapPage'

const ListPageContainer = styled.div`
  height: 100%;
`

const ListPage = () => {
  const { pathname } = useLocation()
  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }

  const dispatch = useDispatch()
  const zoom = useSelector((state) => state.map.view.zoom)
  const totalLocations = useSelector((state) => state.list.totalCount)
  const locations = useSelector((state) => state.list.locations)
  const isNextPageLoading = useSelector((state) => state.list.isLoading)

  useEffect(() => {
    if (pathname === '/list') {
      dispatch(fetchListLocations({ fetchCount: true, offset: 0 }))
    }
  }, [pathname, dispatch])

  let content
  if (zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
    content = <ShouldZoomIn />
  } else if (locations.length === 0 && !isNextPageLoading) {
    content = <NoResultsFound />
  } else {
    content = (
      <InfiniteList
        itemCount={totalLocations}
        width={rect.width}
        height={rect.height}
        locations={locations}
        loadNextPage={() =>
          dispatch(
            fetchListLocations({ offset: locations.length, extend: true }),
          )
        }
        isNextPageLoading={isNextPageLoading}
      />
    )
  }

  return <ListPageContainer ref={container}>{content}</ListPageContainer>
}

export default ListPage
