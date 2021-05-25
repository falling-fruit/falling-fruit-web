import { Rect } from '@reach/rect'
import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { debounce } from 'debounce'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import { useFilteredParams } from '../../utils/useFilteredParams'
import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../map/MapPage'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import SquareButton from '../ui/SquareButton'
import EntryList from './EntryList'
import { NoResultsFound, ShouldZoomIn } from './ListLoading'

const DESKTOP_PAGE_LIMIT = 30
const LIST_ENTRY_HEIGHT = 42

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
`

const ListContainer = styled.div`
  position: relative;
  flex: 1;
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
  const { view, setHoveredLocationId, setListLocations } = useMap()
  const setHoveredLocationIdDebounced = debounce(setHoveredLocationId, 50)
  const getFilteredParams = useFilteredParams()

  const [locations, setLocations] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [totalLocations, setTotalLocations] = useState(0)
  const [loadingNextPage, setLoadingNextPage] = useState(true)

  // If updateOnMapMove flag/checkbox is checked, then the list view is only updated when a new location is "searched"
  const [updateOnMapMove, setUpdateOnMapMove] = useState(true)
  // currentView stores the map viewport to use for when update results on map move is unchecked
  const currentView = useRef()

  const fetchPageWithOffset = useCallback(
    async (offset) => {
      setLoadingNextPage(true)
      setCurrentOffset(offset)

      const locationResults = await getLocations(
        getFilteredParams(
          { limit: DESKTOP_PAGE_LIMIT, offset },
          true,
          currentView.current,
        ),
      )

      setTotalLocations(100) // TODO: fix once /locations endpoint is updated
      setLocations(locationResults)
      setListLocations(locationResults)

      setLoadingNextPage(false)
    },
    [getFilteredParams, setListLocations],
  )

  useEffect(() => {
    const { bounds, center, zoom, newBounds } = view

    if (zoom > VISIBLE_CLUSTER_ZOOM_LIMIT) {
      // When setView(fitContainerBounds(...)) is used (i.e. when searching), bounds appear in newBounds momentarily
      // So we can take advantage of that to know when bounds change due to a search result
      // TODO: This should change to using a new "searched" flag in global state eventually, indicating whether the current
      // bounds are a result of searching
      // TODO: this will all get fixed in Redux
      const properBounds = updateOnMapMove ? bounds : newBounds

      if (properBounds?.ne.lat != null) {
        currentView.current = { zoom, center, bounds: properBounds }
        fetchPageWithOffset(0)
      }
    } else {
      // TODO: this is a temporary fix
      setListLocations([])
    }
  }, [view, updateOnMapMove, fetchPageWithOffset, setListLocations])

  const handleEntryClick = (id) => {
    history.push({
      pathname: `/list/entry/${id}`,
      state: { fromPage: '/list' },
    })
    setHoveredLocationId(null)
  }

  const shouldZoomIn = view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT
  const resultsLoaded = locations.length > 0

  return (
    <Rect>
      {({ rect, ref }) => (
        <Container>
          <ListContainer ref={ref}>
            {shouldZoomIn ? (
              <ShouldZoomIn />
            ) : (
              <>
                {loadingNextPage || resultsLoaded ? (
                  <EntryList
                    itemSize={LIST_ENTRY_HEIGHT}
                    locations={locations}
                    itemCount={locations.length}
                    height={rect?.height ?? 0}
                    width={rect?.width ?? 0}
                    onEntryClick={handleEntryClick}
                    onEntryMouseEnter={setHoveredLocationIdDebounced}
                    onEntryMouseLeave={() =>
                      setHoveredLocationIdDebounced(null)
                    }
                  />
                ) : (
                  <NoResultsFound />
                )}
                {loadingNextPage && (
                  <LoadingOverlay>
                    {!resultsLoaded && <LoadingIndicator />}
                  </LoadingOverlay>
                )}
              </>
            )}
          </ListContainer>
          <PageNav>
            {!shouldZoomIn && locations.length > 0
              ? `Showing Results ${currentOffset + 1} - ${
                  currentOffset + locations.length
                } of ${totalLocations}`
              : 'No Results Found'}
            <NavButtonContainer>
              <SquareButton
                disabled={currentOffset === 0 || shouldZoomIn}
                onClick={() =>
                  fetchPageWithOffset(currentOffset - DESKTOP_PAGE_LIMIT)
                }
              >
                <ChevronLeft />
              </SquareButton>
              <SquareButton
                disabled={
                  currentOffset + DESKTOP_PAGE_LIMIT >= totalLocations ||
                  shouldZoomIn
                }
                onClick={() =>
                  fetchPageWithOffset(currentOffset + DESKTOP_PAGE_LIMIT)
                }
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
      )}
    </Rect>
  )
}

export default PagedList
