import styled from 'styled-components/macro'

const StyledNavPane = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 100%;

  div:last-child {
    flex: 1;
  }
`

const EntryPane = ({ nav, content }) => (
  <StyledNavPane>
    {nav}
    {content}
  </StyledNavPane>
)

export default EntryPane
