import React from 'react'
import styles from './Cluster.module.scss'

// TODO: Cluster styling/icon that Siraj wants
const Cluster = (props) => {
  const { onClick, lat, lng } = props
  return <button className={styles.cluster} onClick={() => onClick(lat, lng)} />
}

export default Cluster
