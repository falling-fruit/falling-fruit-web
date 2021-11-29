import styled from 'styled-components/macro'

const EntryImagesCard = styled.img`
  width: 100%;
  ${({ isFullScreen }) => !isFullScreen && `border-radius: 13px;`}
`

export default EntryImagesCard
