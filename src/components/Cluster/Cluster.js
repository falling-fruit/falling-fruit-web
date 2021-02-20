import React from 'react'
import PropTypes from 'prop-types'
import styles from './Cluster.module.scss'

const MIN_CLUSTER_DIAMETER = 30

const MAX_CLUSTER_DIAMETER = 100

// TODO: Cluster styling/icon that Siraj wants
const Cluster = (props) => {
  const { onClick, lat, lng, count } = props
  const diameter = Math.min(
    Math.max(
      (Math.round(Math.log(count) / Math.log(10)) + 2) * 10,
      MIN_CLUSTER_DIAMETER,
    ),
    MAX_CLUSTER_DIAMETER,
  )

  return (
    <button
      style={{ width: `${diameter}px`, height: `${diameter}px` }}
      className={styles.cluster}
      onClick={() => onClick(lat, lng)}
    >
      <p>{count}</p>
    </button>
  )
}

Cluster.propTypes = {
  onClick: PropTypes.func.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
}

export default Cluster
