import styled from 'styled-components/macro'

import EntryTabs from '../entry/EntryTabs'
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
    <EntryTabs />
  </StyledEntryPane>
)

export default EntryPane
