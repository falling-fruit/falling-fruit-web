import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'

const MapLabel = styled.div`
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

  user-select: none;
`

export default MapLabel
