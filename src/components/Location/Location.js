import PropTypes from 'prop-types'
import React from 'react'

import styles from './Location.module.scss'

// TODO: Location styling/icon that Siraj wants
const Location = (props) => {
  const { onClick, id } = props
  return <button className={styles.location} onClick={() => onClick(id)} />
}

Location.propTypes = {
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
}

export default Location
