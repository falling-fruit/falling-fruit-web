import { useRect } from '@reach/rect'
import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../map/MapPage'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import LoadingIndicator from '../ui/LoadingIndicator'
import SquareButton from '../ui/SquareButton'
import EntryList from './EntryList'
import { NoResultsFound, ShouldZoomIn } from './ListLoading'

const LIMIT = 30

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
`

const ListContainer = styled.div`
  height: 100%;
`

const PageNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const NavButtonContainer = styled.div`
  display: flex;
  button {
    &:not(:last-child) {
      margin-right: 4px;
    }
  }
`

const PagedList = () => {
  const history = useHistory()
  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }
  const { view } = useMap()
  const [locations, setLocations] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [totalLocations, setTotalLocations] = useState(0)
  const [updateOnMapMove, setUpdateOnMapMove] = useState(false)
  // currentView stores the map viewport to use for when update list on map move is unchecked
  const [currentView, setCurrentView] = useState(null)
  const [loadingNextPage, setLoadingNextPage] = useState(false)

  useEffect(() => {
    const setInitialView = () => {
      const { bounds, zoom } = view
      if (
        bounds?.ne.lat != null &&
        zoom > VISIBLE_CLUSTER_ZOOM_LIMIT &&
        (updateOnMapMove || currentView == null)
      ) {
        setCurrentView(view)
        setCurrentOffset(0)
        setLocations([])
      } else if (zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
        setLocations([])
        setCurrentView(undefined)
        setCurrentOffset(0)
      }
    }
    setInitialView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentView])

  useEffect(() => {
    const fetchCurrentListEntries = async () => {
      if (currentView) {
        setLoadingNextPage(true)
        const { bounds, center } = currentView
        // TODO: consolidate querying logic
        const locations = await getLocations({
          swlng: bounds.sw.lng,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          lng: center.lng,
          lat: center.lat,
          limit: LIMIT,
          offset: currentOffset,
        })
        setTotalLocations(locations[1])
        setLocations(locations.slice(2))
        setLoadingNextPage(false)
      }
    }
    fetchCurrentListEntries()
  }, [currentOffset, currentView])

  const handleListEntryClick = (id) => {
    // TODO: Render pin on map for the clicked list entry
    history.push({
      pathname: `/list/entry/${id}`,
      state: { fromPage: '/list' },
    })
  }

  if (view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
    return <ShouldZoomIn />
  }

  return (
    <Container>
      <ListContainer ref={container}>
        {loadingNextPage ? (
          <LoadingIndicator vertical cover />
        ) : locations.length > 0 ? (
          <EntryList
            itemSize={42}
            locations={locations}
            itemCount={locations.length}
            height={rect.height}
            width={rect.width}
            handleListEntryClick={handleListEntryClick}
          />
        ) : (
          <NoResultsFound />
        )}
      </ListContainer>
      <PageNav>
        {locations.length > 0
          ? `Showing Results ${currentOffset + 1} - ${
              currentOffset + locations.length
            }`
          : 'No Results Found'}
        <NavButtonContainer>
          <SquareButton
            disabled={currentOffset === 0}
            onClick={() => setCurrentOffset(currentOffset - LIMIT)}
          >
            <ChevronLeft />
          </SquareButton>
          <SquareButton
            disabled={currentOffset + LIMIT >= totalLocations}
            onClick={() => setCurrentOffset(currentOffset + LIMIT)}
          >
            <ChevronRight />
          </SquareButton>
        </NavButtonContainer>
      </PageNav>

      <LabeledRow
        style={{ padding: 10 }}
        left={
          <Checkbox
            id="update-on-map-move"
            onChange={(e) => setUpdateOnMapMove(e.target.checked)}
            checked={updateOnMapMove}
          />
        }
        label={
          <label htmlFor="update-on-map-move">
            Update results when map moves
          </label>
        }
      />
    </Container>
  )
}

export default PagedList
