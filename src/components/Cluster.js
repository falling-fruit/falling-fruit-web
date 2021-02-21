import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

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

// TODO: Cluster styling/icon that Siraj wants
const ClusterContainer = styled.button`
  width: ${(props) => props.diameter}px;
  height: ${(props) => props.diameter}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: rgba(35, 74, 201, 0.214);
  transform: translate(-50%, -50%);
`

/**
 * Component for a cluster displayed on the map.
 * @param {function} onClick - The handler called when this cluster is clicked
 * @param {number} count - The total number of locations within this cluster
 */
const Cluster = ({ onClick, count }) => {
  const calculateDiameter = (count) =>
    Math.min(
      Math.max((Math.round(Math.log10(count)) + 2) * 10, MIN_CLUSTER_DIAMETER),
      MAX_CLUSTER_DIAMETER,
    )

  return (
    <ClusterContainer diameter={calculateDiameter(count)} onClick={onClick}>
      <p>{count}</p>
    </ClusterContainer>
  )
}

Cluster.propTypes = {
  onClick: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
}

export default Cluster
