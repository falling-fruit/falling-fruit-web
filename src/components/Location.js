import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

// TODO: Location styling/icon that Siraj wants
const LocationContainer = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: red;
  transform: translate(-50%, -50%);
`

const Location = ({ onClick }) => <LocationContainer onClick={onClick} />

Location.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Location
