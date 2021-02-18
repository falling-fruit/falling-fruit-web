import React from 'react'
import styles from './Cluster.module.scss'

// TODO: Cluster styling/icon that Siraj wants
const Cluster = (props) => {
  const { onClick, lat, lng } = props
  return <button onClick={() => onClick(lat, lng)} className={styles.cluster} />
}

export default Cluster
