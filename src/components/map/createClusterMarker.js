import { rgba } from 'polished'

import { theme } from '../ui/GlobalStyle'

/**
 * The minimum cluster diameter in pixels.
 * @constant {number}
 */
const MIN_CLUSTER_DIAMETER = 30

/**
 * The maximum cluster diameter in pixels.
 * @constant {number}
 */
const MAX_CLUSTER_DIAMETER = 100

/**
 * z-index within the shared marker pane. Location dots use 1-2, the geolocation
 * dot uses 5 and location pins use 10-11. Clusters sit just above the location
 * dots (they are never shown together anyway) but below the geolocation dot and
 * pins.
 */
const CLUSTER_Z_INDEX = 3

/**
 * Extra room around the circle so the drop shadow isn't clipped by the SVG
 * viewport.
 */
const SHADOW_PADDING = 6

/**
 * Rounds and formats cluster labels.
 * @param {number} count - The total number of locations within this cluster
 * @return {string} - The rounded number label
 */
const formatClusterLabel = (count) =>
  count < 1000 ? count : `${Math.ceil(count / 1000)}K`

/**
 * Calculates a cluster's diameter given its count.
 * @param {number} count - The total number of locations within this cluster
 * @return {number} - The diameter of the cluster in pixels
 */
const calculateDiameter = (count) =>
  Math.min(
    Math.max((Math.round(Math.log10(count)) + 2) * 10, MIN_CLUSTER_DIAMETER),
    MAX_CLUSTER_DIAMETER,
  )

/**
 * Fixed label font size in pixels. The previous implementation rendered the
 * count in a <p>, which inherited the global `p { font-size: 1.125rem }` with a
 * 14px root, i.e. ~15.75px, regardless of the cluster's diameter. Keep it
 * constant so only the dot size varies.
 */
const LABEL_FONT_SIZE = 15.75

const escapeXml = (text) =>
  String(text).replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      default:
        return '&quot;'
    }
  })

/**
 * Builds the SVG data URI for a cluster of the given count. Mirrors the previous
 * styled circle: blue fill at 90% alpha, soft shadow and white centered label.
 */
const clusterSvgDataUri = (count) => {
  const diameter = calculateDiameter(count)
  const radius = diameter / 2
  const size = diameter + SHADOW_PADDING * 2
  const center = size / 2
  const fontSize = LABEL_FONT_SIZE
  const label = escapeXml(formatClusterLabel(count))
  const fill = rgba(theme.blue, 0.9)
  // theme.fonts contains double quotes ("Noto Sans", ...), which would break a
  // double-quoted XML attribute. Swap them for single quotes so the SVG stays
  // valid; the exact font is not critical for a numeric label.
  const fontFamily = theme.fonts.replace(/"/g, "'")

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="clusterShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="${theme.shadow}" />
    </filter>
  </defs>
  <circle cx="${center}" cy="${center}" r="${radius}" fill="${fill}" filter="url(#clusterShadow)" />
  <text x="${center}" y="${center}" fill="${theme.background}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="400" text-anchor="middle" dominant-baseline="central">${label}</text>
</svg>`

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    size,
  }
}

const getClusterIcon = (google, count) => {
  const { url, size } = clusterSvgDataUri(count)
  return {
    url,
    scaledSize: new google.Size(size, size),
    anchor: new google.Point(size / 2, size / 2),
  }
}

/**
 * Creates a cluster as a google.maps.Marker, so it layers correctly relative to
 * the location markers/pins/geolocation dot via marker zIndex ordering.
 *
 * @param {object} google - google.maps namespace
 * @param {google.maps.Map} map
 * @param {{ lat: number, lng: number, count: number }} cluster
 * @param {{ onClick: function }} options
 */
export const createClusterMarker = (google, map, cluster, { onClick } = {}) => {
  const marker = new google.Marker({
    position: { lat: cluster.lat, lng: cluster.lng },
    map,
    icon: getClusterIcon(google, cluster.count),
    zIndex: CLUSTER_Z_INDEX,
    cursor: onClick ? 'pointer' : undefined,
  })

  marker._cluster = cluster
  marker._clickListener = null

  if (onClick) {
    marker._clickListener = google.event.addListener(
      marker,
      'click',
      (event) => {
        event.stop()
        onClick(marker._cluster, event)
      },
    )
  }

  marker.updateCluster = function (newCluster) {
    if (
      this._cluster.lat !== newCluster.lat ||
      this._cluster.lng !== newCluster.lng
    ) {
      this.setPosition({ lat: newCluster.lat, lng: newCluster.lng })
    }
    if (this._cluster.count !== newCluster.count) {
      this.setIcon(getClusterIcon(google, newCluster.count))
    }
    this._cluster = newCluster
  }

  marker.destroy = function () {
    if (this._clickListener) {
      google.event.removeListener(this._clickListener)
      this._clickListener = null
    }
    google.event.clearInstanceListeners(this)
    this.setMap(null)
  }

  return marker
}
