import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { deleteLocationReview } from '../../redux/locationSlice'
import { DeleteButton, EditButton } from '../ui/ActionButtons'
import ImagePreview, { ImagesContainer } from '../ui/ImagePreview'
import ReviewStats, { getStarRating, Separator, StatsRow } from './ReviewStats'
import { formatISOString } from './textFormatters'

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding-inline: 0.65em;
  padding-block: 0.65em 0.75em;
  border-radius: 0.375em;
  background: ${({ $editable, theme }) =>
    $editable ? theme.navBackground : theme.navBackground};
  &:not(:last-child) {
    margin-block-end: 0.65em;
  }
`

const Label = styled.span`
  font-size: 1rem;
`
const ReviewDescription = styled.section`
  white-space: pre-line;
  word-break: normal;
  overflow-wrap: anywhere;

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.secondaryText};
    margin-block: 0;
    margin-inline: 0;
  }
`

const EditableHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`

const ButtonsRow = styled.div`
  display: flex;
  gap: 1em;
  margin-block-start: 0.5em;
  button {
    color: ${({ theme }) => theme.blue};
  }
`

export const StyledImagePreview = styled(ImagePreview)`
  cursor: pointer;
  margin-inline-end: 7px;
`

const AuthorAndDateRow = styled.div``

const Review = ({
  review,
  onImageClick,
  onEditClick,
  includePreview = true,
  editable = false,
}) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  return (
    <ReviewContainer $editable={editable}>
      {editable && (
        <EditableHeader>
          {t('review.you_reviewed', {
            date: formatISOString(review.created_at, i18n.language),
          })}{' '}
          <ButtonsRow>
            <DeleteButton
              regular
              onClick={() => {
                if (confirm(t('confirm_message.delete_review'))) {
                  dispatch(deleteLocationReview(review.id))
                }
              }}
            />
            <EditButton regular onClick={onEditClick} />
          </ButtonsRow>
        </EditableHeader>
      )}
      {!editable && (
        <AuthorAndDateRow>
          {review.author && (
            <>
              <span dir="auto">
                {review.user_id ? (
                  <Link to={`/users/${review.user_id}`}>{review.author}</Link>
                ) : (
                  review.author
                )}
              </span>
              {' · '}
            </>
          )}
          <span>
            {review.observed_on
              ? t('review.form.observed_on', {
                  date: formatISOString(review.observed_on, i18n.language),
                })
              : review.updated_at &&
                  new Date(review.updated_at) > new Date(review.created_at)
                ? formatISOString(review.updated_at, i18n.language)
                : formatISOString(review.created_at, i18n.language)}
          </span>
        </AuthorAndDateRow>
      )}
      {(review.quality_rating !== null ||
        review.yield_rating !== null ||
        review.fruiting !== null) && (
        <ReviewStats>
          {(review.quality_rating !== null || review.yield_rating !== null) && (
            <StatsRow>
              {review.quality_rating !== null && (
                <span>
                  <Label>{t('glossary.quality')}</Label>{' '}
                  {getStarRating(review.quality_rating)}
                </span>
              )}
              {review.quality_rating !== null &&
                review.yield_rating !== null && <Separator />}
              {review.yield_rating !== null && (
                <span>
                  <Label>{t('glossary.yield')}</Label>{' '}
                  {getStarRating(review.yield_rating)}
                </span>
              )}
            </StatsRow>
          )}
          {review.fruiting !== null && (
            <StatsRow>
              <Label>
                {t('locations.form.fruiting_status')}
                {': '}
                {review.fruiting === 0 && t('locations.infowindow.fruiting.0')}
                {review.fruiting === 1 && t('locations.infowindow.fruiting.1')}
                {review.fruiting === 2 && t('locations.infowindow.fruiting.2')}
              </Label>
            </StatsRow>
          )}
        </ReviewStats>
      )}
      {review.comment && (
        <ReviewDescription>
          <p dir="auto">{review.comment}</p>
        </ReviewDescription>
      )}
      {includePreview && review.photos.length > 0 && (
        <ImagesContainer>
          {review.photos.map((photo, index) => (
            <StyledImagePreview
              $small
              key={photo.thumb}
              onClick={() => onImageClick(index)}
            >
              <img src={photo.thumb} alt={review.title} />
            </StyledImagePreview>
          ))}
        </ImagesContainer>
      )}
    </ReviewContainer>
  )
}

export default Review
