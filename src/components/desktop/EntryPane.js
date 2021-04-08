import styled from 'styled-components/macro'

import EntryDetails from '../entry/EntryDetails'
import EntryNav from '../entry/EntryNav'

const StyledEntryPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ScrollingEntryDetails = styled.div`
  flex: 1;
  overflow: auto;
`

const EntryPane = () => (
  <StyledEntryPane>
    <EntryNav isDesktop />
    <ScrollingEntryDetails>
      <EntryDetails />
    </ScrollingEntryDetails>
  </StyledEntryPane>
)

export default EntryPane
