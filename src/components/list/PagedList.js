import { Rect } from '@reach/rect'
import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { debounce } from 'debounce'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { fetchListLocations, setUpdateOnMapMove } from '../../redux/listSlice'
import { setHoveredLocationId } from '../../redux/mapSlice'
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

  const dispatch = useDispatch()
  const zoom = useSelector((state) => state.map.view.zoom)
  const offset = useSelector((state) => state.list.offset)
  const totalLocations = useSelector((state) => state.list.totalCount)
  const locations = useSelector((state) => state.list.locations)
  const updateOnMapMove = useSelector((state) => state.list.updateOnMapMove)
  const loadingNextPage = useSelector((state) => state.list.isLoading)
  const setHoveredLocationIdDebounced = debounce(
    (id) => dispatch(setHoveredLocationId(id)),
    50,
  )

  const handleEntryClick = (id) => {
    history.push({
      pathname: `/list/entry/${id}`,
      state: { fromPage: '/list' },
    })
    dispatch(setHoveredLocationId(null))
  }

  const shouldZoomIn = zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT
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
              ? `Showing Results ${offset + 1} - ${
                  offset + locations.length
                } of ${totalLocations}`
              : 'No Results Found'}
            <NavButtonContainer>
              <SquareButton
                disabled={offset === 0 || shouldZoomIn}
                onClick={() =>
                  dispatch(
                    fetchListLocations({ offset: offset - DESKTOP_PAGE_LIMIT }),
                  )
                }
              >
                <ChevronLeft />
              </SquareButton>
              <SquareButton
                disabled={
                  offset + DESKTOP_PAGE_LIMIT >= totalLocations || shouldZoomIn
                }
                onClick={() =>
                  dispatch(
                    fetchListLocations({ offset: offset + DESKTOP_PAGE_LIMIT }),
                  )
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
                onChange={(e) => dispatch(setUpdateOnMapMove(e.target.checked))}
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
