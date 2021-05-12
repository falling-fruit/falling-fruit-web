import { ImageAdd } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'

const StyledPhotoGrid = styled.figure`
  padding: 0;
  margin: 0 auto;
  height: 184px;
  width: calc(100% - 20px);
  display: grid;
  grid-template-columns: 1fr 92px;
  grid-template-rows: 50% 50%;
  gap: 6.5px;
  @media ${({ theme }) => theme.device.desktop} {
    // Height is not real height on desktop, add padding = gap
    padding-bottom: 6.5px;
  }

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

  @media only screen and ${({ theme }) => theme.device.mobile} {
    width: 100%;
    gap: 0;
    img {
      border-radius: 0;
    }
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
  font-weight: bold;

  svg {
    width: 31px;
  }

  input {
    display: none;
  }

  @media only screen and ${({ theme }) => theme.device.mobile} {
    border-radius: 0;
    border: none;
  }
`

const ExtraImagesWrapper = styled(ResetButton)`
  display: block;
  position: relative;
  border-radius: 4px;
  @media only screen and ${({ theme }) => theme.device.mobile} {
    border-radius: 0;
  }

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
    color: ${({ theme }) => theme.background};
    background: linear-gradient(
      180deg,
      rgba(48, 45, 44, 0.4) 0%,
      ${({ theme }) => theme.headerText} 100%
    );

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-weight: bold;
    font-size: 13px;

    & > span {
      font-size: 24px;
    }
  }
`

const PhotoData = ({ photos, altText, onViewLightbox }) => {
  const { t } = useTranslation()
  return (
    photos.length > 0 && (
      // TODO: extract PhotoGrid as its own component. Take an array of photos and single alt as prop.
      // TODO: use alt based off of photo description or filename
      <StyledPhotoGrid>
        <img
          className="main-image"
          src={photos[0].photo.medium}
          alt={altText}
        />
        {photos.length > 1 && (
          <ExtraImagesWrapper
            onClick={onViewLightbox}
            disabled={photos.length < 3}
          >
            {photos.length > 2 && (
              <div className="other-photos-mask">
                <span>{photos.length - 2}</span>
                {t('Photos')}
              </div>
            )}
            <img
              className="extra-images"
              src={photos[1].photo.medium}
              alt={altText}
            />
          </ExtraImagesWrapper>
        )}
        <ImageUpload>
          <ImageAdd />
          {t('Add Photo')}
          <input type="file" />
        </ImageUpload>
      </StyledPhotoGrid>
    )
  )
}

export default PhotoData
