import { useRect } from '@reach/rect'
import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import Checkbox from '../ui/Checkbox'
import SquareButton from '../ui/SquareButton'
import EntryList from './EntryList'

const LIMIT = 30

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledListContainer = styled.div`
  height: 100%;
`

const StyledPageInfo = styled.div`
  display: flex;
  flex-direction: column;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`

const StyledPageNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const StyledNavButtonContainer = styled.div`
  display: flex;
`

const StyledCheckboxContainer = styled.div`
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
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [updateOnMapMove, setUpdateOnMapMove] = useState(false)
  const [currentView, setCurrentView] = useState(undefined)

  useEffect(() => {
    const setInitialView = () => {
      const { bounds, zoom } = view
      if (
        bounds?.ne.lat != null &&
        zoom > 12 &&
        (updateOnMapMove || currentView === undefined)
      ) {
        setCurrentView(view)
      } else if (zoom <= 12) {
        setLocations([])
        setCurrentView(undefined)
        setCurrentPage(0)
      }
    }
    setInitialView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, updateOnMapMove])

  useEffect(() => {
    const fetchCurrentListEntries = async () => {
      if (currentView !== undefined) {
        const { bounds, center } = currentView
        const locations = await getLocations({
          swlng: bounds.sw.lng,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          lng: center.lng,
          lat: center.lat,
          limit: LIMIT,
          offset: currentPage * LIMIT,
        })
        setTotalPages(Math.ceil(locations[1] / LIMIT))
        setLocations(locations.slice(2))
      }
    }
    fetchCurrentListEntries()
  }, [currentPage, currentView])

  const handleCheckboxClick = () => setUpdateOnMapMove(!updateOnMapMove)

  const handlePreviousPageClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPageClick = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleListEntryClick = (id) => {
    // TODO: Render pin on map for the clicked list entry
    history.push({
      pathname: `/entry/${id}`,
      state: { fromPage: '/map' },
    })
  }

  return (
    <StyledContainer>
      <StyledListContainer ref={container}>
        <EntryList
          itemSize={42}
          locations={locations}
          itemCount={locations.length}
          height={rect.height}
          width={rect.width}
          handleListEntryClick={handleListEntryClick}
        />
      </StyledListContainer>
      <StyledPageInfo visible={locations.length > 0}>
        <StyledPageNav>
          Showing Results {currentPage + 1} - {totalPages}
          <StyledNavButtonContainer>
            <SquareButton
              icon={<ChevronLeft />}
              disabled={!currentPage}
              onClick={handlePreviousPageClick}
            />
            <SquareButton
              icon={<ChevronRight />}
              disabled={currentPage + 1 === totalPages}
              onClick={handleNextPageClick}
            />
          </StyledNavButtonContainer>
        </StyledPageNav>
        <StyledCheckboxContainer>
          <Checkbox
            id="update-on-map-move"
            name="update-on-map-move"
            onChange={handleCheckboxClick}
            checked={updateOnMapMove}
          />
          Update results when map moves
        </StyledCheckboxContainer>
      </StyledPageInfo>
    </StyledContainer>
  )
}

export default PagedList
