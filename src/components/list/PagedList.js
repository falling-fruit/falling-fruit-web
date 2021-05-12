import { useRect } from '@reach/rect'
import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import Checkbox from '../ui/Checkbox'
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

const PageInfo = styled.div`
  display: flex;
  flex-direction: column;
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

const CheckboxContainer = styled.div`
  display: flex;
  padding: 10px;
  color: ${({ theme }) => theme.secondaryText};
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
  const [currentView, setCurrentView] = useState(undefined)
  const [loadingNextPage, setLoadingNextPage] = useState(false)

  useEffect(() => {
    const setInitialView = () => {
      const { bounds, zoom } = view
      if (
        bounds?.ne.lat != null &&
        zoom > 12 &&
        (updateOnMapMove || currentView === undefined)
      ) {
        setCurrentView(view)
        setCurrentOffset(0)
        setLocations([])
      } else if (zoom <= 12) {
        setLocations([])
        setCurrentView(undefined)
        setCurrentOffset(0)
      }
    }
    setInitialView()
  }, [view, updateOnMapMove, currentView])

  useEffect(() => {
    const fetchCurrentListEntries = async () => {
      if (currentView !== undefined) {
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

  const handleCheckboxClick = () => setUpdateOnMapMove(!updateOnMapMove)

  const handleListEntryClick = (id) => {
    // TODO: Render pin on map for the clicked list entry
    history.push({
      pathname: `/entry/${id}`,
      state: { fromPage: '/map' },
    })
  }

  return (
    <Container>
      {view.zoom > 12 ? (
        <>
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
          <PageInfo>
            <PageNav>
              {locations.length > 0 ? (
                <>
                  Showing Results {currentOffset + 1} -{' '}
                  {currentOffset + locations.length}
                </>
              ) : (
                <>No Results Found</>
              )}
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
            {/* TODO: Eventually use Label component in Archna's settings PR */}
            <CheckboxContainer>
              <Checkbox
                id="update-on-map-move"
                name="update-on-map-move"
                onChange={handleCheckboxClick}
                checked={updateOnMapMove}
              />
              Update results when map moves
            </CheckboxContainer>
          </PageInfo>
        </>
      ) : (
        <ShouldZoomIn />
      )}
    </Container>
  )
}

export default PagedList
