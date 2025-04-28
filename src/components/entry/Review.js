import { Pencil as PencilIcon } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import ResetButton from '../ui/ResetButton'
import ReviewStats, { getStarRating, Separator, StatsRow } from './ReviewStats'
import { formatISOString } from './textFormatters'

const ReviewContainer = styled.div`
  padding-block-end: 15px;

  &:not(:last-child) {
    margin-block-end: 15px;
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

  margin-block-end: 1em;
  margin-block-start: 1em;
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
  margin-block-end: 0.6em;

  button {
    display: flex;
    align-items: center;
    margin-block-start: 0.2em;
    color: ${({ theme }) => theme.blue};
    text-decoration: underline;

    svg {
      margin-inline-end: 0.2em;
    }
  }
`

export const StyledImagePreview = styled(ImagePreview)`
  cursor: pointer;
  margin-inline-end: 7px;
`

const AuthorAndDateRow = styled.div`
  margin-block-end: 0.5em;
`

const Review = ({
  review,
  onImageClick,
  onEditClick,
  includePreview = true,
  editable = false,
}) => {
  const { t, i18n } = useTranslation()
  return (
    <ReviewContainer $editable={editable}>
      {editable && (
        <EditableHeader>
          {t('review.you_reviewed', {
            date: formatISOString(review.created_at, i18n.language),
          })}{' '}
          <ResetButton onClick={onEditClick}>
            <PencilIcon height={14} /> {t('review.update_delete')}
          </ResetButton>
        </EditableHeader>
      )}
      {!editable && (
        <AuthorAndDateRow>
          {review.author && (
            <>
              {review.user_id ? (
                <Link to={`/profiles/${review.user_id}`}>{review.author}</Link>
              ) : (
                review.author
              )}
              {' · '}
            </>
          )}
          {review.observed_on
            ? t('review.form.observed_on', {
                date: formatISOString(review.observed_on, i18n.language),
              })
            : review.updated_at &&
                new Date(review.updated_at) > new Date(review.created_at)
              ? formatISOString(review.updated_at, i18n.language)
              : formatISOString(review.created_at, i18n.language)}
        </AuthorAndDateRow>
      )}
      <ReviewStats>
        <StatsRow>
          {review.quality_rating !== null && (
            <span>
              <Label>{t('glossary.quality')}</Label>{' '}
              {getStarRating(review.quality_rating)}
            </span>
          )}
          {review.quality_rating !== null && review.yield_rating !== null && (
            <Separator />
          )}
          {review.yield_rating !== null && (
            <span>
              <Label>{t('glossary.yield')}</Label>{' '}
              {getStarRating(review.yield_rating)}
            </span>
          )}
        </StatsRow>
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
