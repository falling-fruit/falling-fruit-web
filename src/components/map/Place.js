import { Cross } from '@styled-icons/boxicons-regular'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import Label from './Label'

// based on AddLocationPin
const PlaceCross = styled(Cross)`
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
  color: ${theme.green};
`

const Place = ({ label, ...props }) => (
  <>
    <PlaceCross {...props} />
    <Label>{label}</Label>
  </>
)

Place.propTypes = {
  label: PropTypes.string,
}

export default Place
