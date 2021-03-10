import GoogleMap, { fitBounds } from 'google-map-react'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

import Cluster from './Cluster'
import Location from './Location'

/**
 * Wrapper component around google-map-react.
 * @param {string} googleMapsAPIKey - The google maps API key
 * @param {Object} view - The current view state
 * @param {Object[]} locations - The locations to display
 * @param {Object[]} clusters - The clusters to display
 * @param {function} onClusterClick - The function called when a cluster is clicked
 * @param {function} onLocationClick - The function called when a location is clicked
 * @param {function} onViewChange - The function called when the view state is changed
 */
const Map = ({
  googleMapsAPIKey,
  view,
  locations,
  clusters,
  onClusterClick,
  onLocationClick,
  onViewChange,
}) => {
  const mapRef = useRef(null)

  useEffect(() => {
    if (view.bounds && mapRef.current) {
      const { offsetWidth, offsetHeight } = mapRef.current.getDiv()
      const { center, zoom } = fitBounds(view.bounds, {
        width: offsetWidth,
        height: offsetHeight,
      })

      mapRef.current.setCenter(center)
      mapRef.current.setZoom(zoom)
    }
  }, [view.bounds])

  return (
    <GoogleMap
      bootstrapURLKeys={{ key: googleMapsAPIKey }}
      center={view.center}
      zoom={view.zoom}
      onChange={onViewChange}
      resetBoundsOnResize
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map }) => {
        mapRef.current = map
      }}
    >
      {clusters.map((cluster) => (
        <Cluster
          key={JSON.stringify(cluster)}
          onClick={() => onClusterClick(cluster)}
          count={cluster.count}
          lat={cluster.lat}
          lng={cluster.lng}
        />
      ))}
      {locations.map((location) => (
        <Location
          key={location.id}
          onClick={() => onLocationClick(location)}
          lat={location.lat}
          lng={location.lng}
        />
      ))}
    </GoogleMap>
  )
}

Map.propTypes = {
  googleMapsAPIKey: PropTypes.string.isRequired,
  view: PropTypes.object.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
}

export default Map
