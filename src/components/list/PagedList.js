import { useRect } from '@reach/rect'
import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import SquareButton from '../ui/SquareButton'
import FixedSizeList from './FixedSizeList'

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
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const StyledPageNav = styled.div`
  display: flex;
`

const PagedList = () => {
  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }
  const { view } = useMap()
  const [locations, setLocations] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

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
        setCurrentPage(0)
        setTotalPages(Math.ceil(locations[1] / LIMIT))
        setLocations(locations.slice(2))
      } else {
        setLocations([])
      }
    }
    fetchListEntries()
  }, [view])

  const handlePreviousPageClick = async () => {
    if (currentPage > 0) {
      const { bounds, center } = view
      const locations = await getLocations({
        swlng: bounds.sw.lng,
        nelng: bounds.ne.lng,
        swlat: bounds.sw.lat,
        nelat: bounds.ne.lat,
        lng: center.lng,
        lat: center.lat,
        limit: LIMIT,
        offset: (currentPage - 1) * LIMIT,
      })
      setTotalPages(Math.ceil(locations[1] / LIMIT))
      setLocations(locations.slice(2))
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPageClick = async () => {
    if (currentPage + 1 < totalPages) {
      const { bounds, center } = view
      const locations = await getLocations({
        swlng: bounds.sw.lng,
        nelng: bounds.ne.lng,
        swlat: bounds.sw.lat,
        nelat: bounds.ne.lat,
        lng: center.lng,
        lat: center.lat,
        limit: LIMIT,
        offset: (currentPage + 1) * LIMIT,
      })
      setTotalPages(Math.ceil(locations[1] / LIMIT))
      setLocations(locations.slice(2))
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <StyledContainer>
      <StyledListContainer ref={container}>
        <FixedSizeList
          itemSize={42}
          locations={locations}
          itemCount={locations.length}
          height={rect.height}
          width={rect.width}
        />
      </StyledListContainer>
      <StyledPageInfo visible={locations.length > 0}>
        Showing Results {currentPage + 1} - {totalPages}
        <StyledPageNav>
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
        </StyledPageNav>
      </StyledPageInfo>
    </StyledContainer>
  )
}

export default PagedList
