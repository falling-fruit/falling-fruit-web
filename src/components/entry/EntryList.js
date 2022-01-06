import { ArrowBack as ArrowBackIcon } from '@styled-icons/boxicons-regular'
import { Pencil as PencilIcon } from '@styled-icons/boxicons-solid'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getPathWithMapState } from '../../utils/getInitialUrl'
import IconButton from '../ui/IconButton'
import Carousel from './Carousel'
import Entry from './Entry'

const ENTRY_IMAGE_HEIGHT = 250

const BUTTON_HEIGHT = 80

const Container = styled.div`
  margin-top: ${BUTTON_HEIGHT}px;

  .pane {
    background: none;
    ${({ isFullScreen }) => isFullScreen && `padding-top: 0;`}
    ${({ showEntryImages, isFullScreen }) =>
      !showEntryImages && isFullScreen && `box-shadow: none;`}
  }

  > div {
    background: white;
    height: 100% !important;
  }
`

const EntryImages = styled.div`
  width: 100%;
  height: ${ENTRY_IMAGE_HEIGHT}px;
  position: absolute;
  top: 0;
  transform: translateY(
    ${({ heightScalar }) => -heightScalar * ENTRY_IMAGE_HEIGHT}px
  );
  transition: transform 0.15s linear;
  z-index: -10;
`

const Buttons = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 12;
  padding: 16px;
  display: flex;
  justify-content: space-between;
`

const EntryButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  svg {
    color: white;
  }
`

const Backdrop = styled.div`
  width: 100%;
  height: ${BUTTON_HEIGHT}px;
  position: absolute;
  top: 0;
  background: white;
  z-index: -10;
`

const EntryDrawer = ({
  locationData,
  reviews,
  showEntryImages,
  isLoading,
  entryOverview,
  entryReviews,
}) => {
  const history = useHistory()

  const allReviewPhotos = (reviews ?? [])
    .map((reviews) => reviews.photos)
    .flat()

  return (
    <>
      {
        <Buttons showEntryImages={showEntryImages}>
          <EntryButton
            onClick={() => history.push(getPathWithMapState('/list'))}
            size={48}
            icon={<ArrowBackIcon />}
            label="back-button"
          />
          <EntryButton size={48} icon={<PencilIcon />} label="edit-button" />
        </Buttons>
      }
      <Container showEntryImages={showEntryImages} isFullScreen>
        <div>
          {showEntryImages ? (
            <EntryImages heightScalar={1}>
              <Carousel
                showIndicators={allReviewPhotos.length > 1}
                isFullscreen
              >
                {allReviewPhotos.map((photo) => (
                  <img key={photo.id} src={photo.medium} alt="entry" />
                ))}
              </Carousel>
            </EntryImages>
          ) : (
            <Backdrop isFullScreen />
          )}
          <Entry
            showEntryImages={showEntryImages}
            isFullScreen
            isInDrawer
            showTabs
            locationData={locationData}
            reviews={reviews}
            isLoading={isLoading}
            entryOverview={entryOverview}
            entryReviews={entryReviews}
          />
        </div>
      </Container>
    </>
  )
}

export default EntryDrawer
