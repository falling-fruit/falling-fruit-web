import styled from 'styled-components/macro'

import EntryDetails from '../entry/EntryDetails'
import EntryBack from './EntryBack'

const StyledEntryPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  div:last-child {
    flex: 1;
  }
`

const EntryPane = () => (
  <StyledEntryPane>
    <EntryBack />
    <EntryDetails />
  </StyledEntryPane>
)

export default EntryPane
