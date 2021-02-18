import React from 'react'
import styles from './Marker.module.scss'

// TODO: Marker styling/icon that Siraj wants
const Marker = (props) => {
  const { onClick, id } = props
  return <button className={styles.marker} onClick={() => onClick(id)} />
}

export default Marker
