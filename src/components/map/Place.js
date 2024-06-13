import { Cross } from '@styled-icons/boxicons-regular'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'

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

const Label = styled.div`
  font-size: 0.875rem;
  color: ${theme.headerText};
  margin-top: -5px;
  /* Centers labels under each location */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* Centers text inside the label */
  text-align: center;
  /* Prevents line breaks */
  white-space: nowrap;
  z-index: 1;

  text-shadow:
    -1px -1px 0 ${theme.background},
    1px -1px 0 ${theme.background},
    -1px 1px 0 ${theme.background},
    1px 1px 0 ${theme.background};
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
