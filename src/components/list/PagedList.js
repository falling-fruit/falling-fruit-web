import { useContext, useEffect, useState } from 'react'

import { getLocations } from '../../utils/api'
import MapContext from '../map/MapContext'
import FixedSizeList from './FixedSizeList'

const LIMIT = 30

const PagedList = () => {
  const { view } = useContext(MapContext)
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
        console.log('HERE: ', locations)
      }
    }
    fetchListEntries()
  }, [view])

  return (
    <FixedSizeList
      itemSize={42}
      height={800}
      width={310}
      locations={locations}
      itemCount={30}
    />
  )
}

export default PagedList
