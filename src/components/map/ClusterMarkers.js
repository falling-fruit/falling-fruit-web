import { useEffect, useRef } from 'react'

import { createClusterMarker } from './createClusterMarker'

/**
 * Stable-ish key for a cluster. Clusters have no id and are recomputed on each
 * view change, but two clusters at the same position with the same count are
 * visually identical, so we can reuse the marker instead of recreating it.
 */
const clusterKey = (cluster) => `${cluster.lat},${cluster.lng},${cluster.count}`

const ClusterMarkers = ({
  clusters,
  googleMap,
  getGoogleMaps,
  onClusterClick,
}) => {
  const markersRef = useRef(new Map())

  // Keep the latest click handler available without recreating markers.
  const onClusterClickRef = useRef(onClusterClick)
  useEffect(() => {
    onClusterClickRef.current = onClusterClick
  }, [onClusterClick])

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return undefined
    }

    const google = getGoogleMaps()
    const currentMarkers = markersRef.current

    const nextKeys = new Set(clusters.map(clusterKey))
    const existingKeys = new Set(currentMarkers.keys())

    // Remove markers no longer present.
    existingKeys.forEach((key) => {
      if (!nextKeys.has(key)) {
        const marker = currentMarkers.get(key)
        marker.destroy()
        currentMarkers.delete(key)
      }
    })

    // Ensure markers are attached to the current map (e.g. after remount).
    currentMarkers.forEach((marker) => {
      if (marker.getMap() !== googleMap) {
        marker.setMap(googleMap)
      }
    })

    // Create markers for new clusters.
    clusters.forEach((cluster) => {
      const key = clusterKey(cluster)
      if (!currentMarkers.has(key)) {
        const marker = createClusterMarker(google, googleMap, cluster, {
          onClick: (clickedCluster, event) =>
            onClusterClickRef.current?.(clickedCluster, event),
        })
        currentMarkers.set(key, marker)
      }
    })

    return undefined
  }, [clusters, googleMap, getGoogleMaps])

  // Clean up all markers on unmount / map change.
  useEffect(
    () => () => {
      markersRef.current.forEach((marker) => marker.destroy())
      markersRef.current.clear()
    },
    [getGoogleMaps],
  )

  return null
}

export default ClusterMarkers
