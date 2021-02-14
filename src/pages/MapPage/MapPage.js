import React, { useState } from 'react'
import styles from './MapPage.module.scss'
import Map from '../../components/Map/Map.js'

// Mock location data
const locations = [
  {
    id: 1,
    lat: 40.1127151,
    lng: -88.2314734,
  },
  {
    id: 2,
    lat: 40.1125785,
    lng: -88.2287926,
  },
  {
    id: 3,
    lat: 40.112657,
    lng: -88.2278543,
  },
  {
    id: 4,
    lat: 60.1125785,
    lng: -88.2287926,
  },
  {
    id: 5,
    lat: 60.112657,
    lng: -88.2278543,
  },
]

const DEFAULT_VIEW_STATE = {
  center: {
    lat: 40.1125785,
    lng: -88.2287926,
  },
  zoom: 2,
}

const MapPage = () => {
  const [view, setView] = useState(DEFAULT_VIEW_STATE)
  const [mapRef, setMapRef] = useState(null)

  const onLocationSelect = (locationId) => {
    console.log(`Location: ${locationId} selected!`)
  }

  const onClusterSelect = () => {
    console.log(`You have selected a cluster!`)
  }

  // TODO: Figure out which callbacks and values we need to store in the view object
  const onZoomChanged = () => {
    const newZoom = mapRef.getZoom()
    setView((prev) => ({
      ...prev,
      zoom: newZoom,
    }))
  }

  const onCenterChanged = () => {
    const newCenter = mapRef.getCenter().toJSON()
    setView((prev) => ({
      ...prev,
      center: newCenter,
    }))
  }

  const onBoundsChanged = () => {
    // TODO: Store bounds in the view object?
    const currBounds = mapRef.getBounds().toJSON()
    console.log('Bounds changed: ', currBounds)
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        onClusterSelect={onClusterSelect}
        onLocationSelect={onLocationSelect}
        onZoomChanged={onZoomChanged}
        onCenterChanged={onCenterChanged}
        onBoundsChanged={onBoundsChanged}
        view={view}
        locations={locations}
        setMapRef={setMapRef}
      />
    </div>
  )
}

export default MapPage
