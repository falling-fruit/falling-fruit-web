import { useEffect, useRef } from 'react'

import { createClusterMarker } from './createClusterMarker'

const clusterKey = (cluster) => `${cluster.lat},${cluster.lng},${cluster.count}`

const ClusterMarkers = ({
  clusters,
  googleMap,
  getGoogleMaps,
  onClusterClick,
}) => {
  const markersRef = useRef(new Map())

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

    existingKeys.forEach((key) => {
      if (!nextKeys.has(key)) {
        const marker = currentMarkers.get(key)
        marker.destroy()
        currentMarkers.delete(key)
      }
    })

    currentMarkers.forEach((marker) => {
      if (marker.getMap() !== googleMap) {
        marker.setMap(googleMap)
      }
    })

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
