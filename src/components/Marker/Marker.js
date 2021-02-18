import React from 'react'
import styles from './Marker.module.scss'

// TODO: Marker styling/icon that Siraj wants
const Marker = (props) => {
  const { onClick, lat, lng } = props
  return <button onClick={() => onClick(lat, lng)} className={styles.marker} />
}

export default Marker
