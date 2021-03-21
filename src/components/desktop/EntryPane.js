import styled from 'styled-components/macro'

import EntryDetails from '../entry/EntryDetails'
import EntryNav from '../entry/EntryNav'

const StyledEntryPane = styled.div`
  overflow: hidden;
`

const EntryPane = () => (
  <StyledEntryPane>
    <EntryNav isDesktop />
    <EntryDetails isDesktop />
  </StyledEntryPane>
)

export default EntryPane
