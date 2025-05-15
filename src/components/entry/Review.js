import { Pencil, Trash } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { deleteLocationReview } from '../../redux/locationSlice'
import ImagePreview from '../ui/ImagePreview'
import ResetButton from '../ui/ResetButton'
import ReviewStats, { getStarRating, Separator, StatsRow } from './ReviewStats'
import { formatISOString } from './textFormatters'

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding-block-end: 0.5em;

  &:not(:last-child) {
    margin-block-end: 0.5em;
  }

  ${({ $editable, theme }) =>
    `
    background: ${$editable ? theme.navBackground : theme.navBackground};
    padding: 0.6em;
    border-radius: 0.375em;
  `}
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
    margin-block: 0 4px;
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
  width: 100%;
  margin-block-start: 0.5em;

  button {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.blue};

    svg {
      margin-inline-end: 0.2em;
    }
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
            <ResetButton
              onClick={() => {
                if (confirm('Are you sure you want to delete this review?')) {
                  dispatch(deleteLocationReview(review.id))
                }
              }}
            >
              <Trash height={14} /> {t('form.button.delete')}
            </ResetButton>
            <ResetButton onClick={onEditClick}>
              <Pencil height={14} /> {t('form.button.edit')}
            </ResetButton>
          </ButtonsRow>
        </EditableHeader>
      )}
      {!editable && (
        <AuthorAndDateRow>
          {review.author && (
            <>
              <span dir="auto">
                {review.user_id ? (
                  <Link to={`/profiles/${review.user_id}`}>
                    {review.author}
                  </Link>
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
      <ReviewDescription>
        <p dir="auto">{review.comment}</p>
      </ReviewDescription>
      {includePreview &&
        review.photos.map((photo, index) => (
          <StyledImagePreview
            $small
            key={photo.thumb}
            onClick={() => onImageClick(index)}
          >
            <img src={photo.thumb} alt={review.title} />
          </StyledImagePreview>
        ))}
    </ReviewContainer>
  )
}

export default Review
