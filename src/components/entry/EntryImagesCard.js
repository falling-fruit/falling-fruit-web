import styled from 'styled-components/macro'

import EntryTags from './EntryTags'

const EntryTagsContainer = styled.div`
  position: absolute;
  bottom: 0;
  margin-left: 23px;
`
const EntryImagesCard = ({ image, showTags, locationData }) => (
  <div style={{ width: '100%' }} className="entry-images-card">
    <img style={{ width: '100%' }} src={image} alt={'entry-background'} />
    <EntryTagsContainer>
      {showTags && <EntryTags locationData={locationData} />}
    </EntryTagsContainer>
  </div>
)

export default EntryImagesCard
