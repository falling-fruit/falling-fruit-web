import { useRect } from '@reach/rect'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { getLocations } from '../../utils/api'
import FixedSizeList from './FixedSizeList'

const LIMIT = 30

const StyledListContainer = styled.div`
  height: 100%;
`

const PagedList = () => {
  const container = useRef()
  const rect = useRect(container) ?? { width: 0, height: 0 }
  const { view } = useMap()
  const [locations, setLocations] = useState([])
  // const [hasMoreItems, setHasMoreItems] = useState(false)
  // const [isNextPageLoading, setIsNextPageLoading] = useState(false)

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
        // setHasMoreItems(locations[0] < locations[1])
        setLocations(locations.slice(2))
        // console.log('HERE: ', locations)
      }
    }
    fetchListEntries()
  }, [view])

  return (
    <StyledListContainer ref={container}>
      <FixedSizeList
        itemSize={42}
        locations={locations}
        itemCount={locations.length}
        height={rect.height}
        width={rect.width}
      />
    </StyledListContainer>
  )
}

export default PagedList