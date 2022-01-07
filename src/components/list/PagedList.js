import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { debounce } from 'debounce'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components/macro'

import { fetchListLocations, setUpdateOnMapMove } from '../../redux/listSlice'
import { setHoveredLocationId } from '../../redux/mapSlice'
import { getIsShowingClusters } from '../../redux/viewChange'
import { useAppHistory } from '../../utils/useAppHistory'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import LoadingIndicator, { LoadingOverlay } from '../ui/LoadingIndicator'
import SquareButton from '../ui/SquareButton'
import EntryList from './EntryList'
import { NoResultsFound, ShouldZoomIn } from './ListLoading'

const DESKTOP_PAGE_LIMIT = 30
const LIST_ENTRY_HEIGHT = 42

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
`

const ListContainer = styled.div`
  position: relative;
  flex: 1;
  border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const PageNav = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;

  span {
    flex: 1;
  }

  button:not(:last-child) {
    margin-right: 4px;
  }
`

const PagedList = () => {
  const history = useAppHistory()

  const dispatch = useDispatch()
  const offset = useSelector((state) => state.list.offset)
  const totalLocations = useSelector((state) => state.list.totalCount)
  const locations = useSelector((state) => state.list.locations)
  const updateOnMapMove = useSelector((state) => state.list.updateOnMapMove)
  const loadingNextPage = useSelector((state) => state.list.isLoading)
  const isShowingClusters = useSelector(getIsShowingClusters)
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

  const resultsLoaded = locations.length > 0

  return (
    <Page>
      <ListContainer>
        {isShowingClusters ? (
          <ShouldZoomIn />
        ) : (
          <>
            {loadingNextPage || resultsLoaded ? (
              <AutoSizer>
                {({ height, width }) => (
                  <EntryList
                    itemSize={LIST_ENTRY_HEIGHT}
                    locations={locations}
                    itemCount={locations.length}
                    height={height}
                    width={width}
                    onEntryClick={handleEntryClick}
                    onEntryMouseEnter={setHoveredLocationIdDebounced}
                    onEntryMouseLeave={() =>
                      setHoveredLocationIdDebounced(null)
                    }
                  />
                )}
              </AutoSizer>
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
        <span>
          {!isShowingClusters && locations.length > 0
            ? `Showing Results ${offset + 1} - ${
                offset + locations.length
              } of ${totalLocations}`
            : 'No Results Found'}
        </span>
        <SquareButton
          disabled={offset === 0 || isShowingClusters}
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
            offset + DESKTOP_PAGE_LIMIT >= totalLocations || isShowingClusters
          }
          onClick={() =>
            dispatch(
              fetchListLocations({ offset: offset + DESKTOP_PAGE_LIMIT }),
            )
          }
        >
          <ChevronRight />
        </SquareButton>
      </PageNav>

      <LabeledRow
        style={{ margin: 10 }}
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
    </Page>
  )
}

export default PagedList
