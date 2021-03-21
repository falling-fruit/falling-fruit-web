import { ImageAdd } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const StyledPhotoGrid = styled.figure`
  padding: 0;
  margin: 0 auto;
  height: 184px;
  width: calc(100% - 20px);

  display: grid;
  grid-template-columns: 1fr 92px;
  grid-template-rows: 50% 50%;
  gap: 6.5px;
  grid-template-areas:
    'main-image extra-image'
    'main-image add-more';

  .main-image {
    grid-area: main-image;
  }
  .extra-images {
    grid-area: extra-image;
  }
  .add-more {
    grid-area: add-more;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`

const ImageUpload = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: 13px;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 4px;
  border: 2px solid ${({ theme }) => theme.text};
  font-weight: 700;

  svg {
    width: 31px;
  }

  input {
    display: none;
  }
`

const ExtraImagesWrapper = styled.button`
  display: block;
  cursor: pointer;
  padding: 0;
  border: none;
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  &:disabled {
    pointer-events: none;
  }

  & > img {
    left: 0;
    top: 0;
  }

  & > .other-photos-mask {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    color: white;
    background: linear-gradient(
      180deg,
      rgba(48, 45, 44, 0.4) 0%,
      ${({ theme }) => theme.headerText} 100%
    );

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-weight: 700;
    font-size: 13px;

    & > span {
      font-size: 24px;
    }
  }
`

const PhotoData = ({ locationData, onViewLightbox }) =>
  locationData.photos.length > 0 && (
    // TODO: extract PhotoGrid as its own component. Take an array of photos and single alt as prop.
    // TODO: use alt based off of photo description or filename
    <StyledPhotoGrid>
      <img
        className="main-image"
        src={locationData.photos[0].photo.medium}
        alt={locationData.type_names.join(', ')}
      />
      {locationData.photos.length > 1 && (
        <ExtraImagesWrapper
          onClick={onViewLightbox}
          disabled={locationData.photos.length < 3}
        >
          {locationData.photos.length > 2 && (
            <div className="other-photos-mask">
              <span>{locationData.photos.length - 2}</span>
              Photos
            </div>
          )}
          <img
            className="extra-images"
            src={locationData.photos[1].photo.medium}
            alt={locationData.type_names.join(', ')}
          />
        </ExtraImagesWrapper>
      )}
      <ImageUpload>
        <ImageAdd />
        Add Photo
        <input type="file" />
      </ImageUpload>
    </StyledPhotoGrid>
  )

export default PhotoData
