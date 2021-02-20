import React from 'react'

import styles from './Location.module.scss'

// TODO: Location styling/icon that Siraj wants
const Location = (props) => {
  const { onClick, id } = props
  return <button className={styles.location} onClick={() => onClick(id)} />
}

export default Location
