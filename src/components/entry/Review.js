import { Pencil as PencilIcon } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import Rating from '../ui/Rating'
import ResetButton from '../ui/ResetButton'
import { formatISOString } from './textFormatters'

const ReviewContainer = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  position: relative;

  :after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -23px;
    width: calc(100% + 46px);
    height: 1px;
    background: ${({ theme }) => theme.secondaryBackground};

    @media ${({ theme }) => theme.device.desktop} {
      left: -12px;
      width: calc(100% + 24px);
    }
  }

  ${({ $editable, theme }) =>
    $editable &&
    `
    background: ${theme.navBackground};
    padding: 0.6em;
    border-radius: 0.375em;

    :after {
      display: none;
    }
  `}
`
const Label = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.tertiaryText};
  margin: 3px 0px;
`
const RatingTable = styled.table`
  width: 100%;
  margin-bottom: 6px;
  border-spacing: 0;
  line-height: 1.14;

  td:nth-child(2) {
    width: 100%;
    text-align: right;
  }
  td {
    padding: 0;
  }
`
const ReviewDescription = styled.section`
  white-space: pre-line;
  word-break: normal;
  overflow-wrap: anywhere;

  margin-bottom: 8px;
  blockquote {
    font-size: 1rem;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0 0 4px 0;
  }
  cite {
    font-style: italic;
    font-size: 0.875rem;
  }
`

const EditableHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.6em;

  button {
    display: flex;
    align-items: center;
    margin-top: 0.2em;
    color: ${({ theme }) => theme.blue};
    text-decoration: underline;

    svg {
      margin-right: 0.2em;
    }
  }
`

export const StyledImagePreview = styled(ImagePreview)`
  cursor: pointer;
  margin-right: 7px;
`

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.tertiaryText};
`

const Review = ({
  review,
  onImageClick,
  onEditClick,
  includePreview = true,
  editable = false,
}) => {
  const { t } = useTranslation()
  return (
    <ReviewContainer $editable={editable}>
      {editable && (
        <EditableHeader>
          {t('review.you_reviewed', {
            date: formatISOString(review.created_at),
          })}{' '}
          <ResetButton onClick={onEditClick}>
            <PencilIcon height={14} /> {t('review.update_delete')}
          </ResetButton>
        </EditableHeader>
      )}
      <RatingTable>
        <tbody>
          {review.fruiting !== null && (
            <tr>
              <td>
                <Label>Fruiting</Label>
              </td>
              <td>
                {review.fruiting === 0 && t('locations.infowindow.fruiting.0')}
                {review.fruiting === 1 && t('locations.infowindow.fruiting.1')}
                {review.fruiting === 2 && t('locations.infowindow.fruiting.2')}
              </td>
            </tr>
          )}
          {review.quality_rating !== null && (
            <tr>
              <td>
                <Label>{t('glossary.quality')}</Label>
              </td>
              <td>
                <Rating score={review.quality_rating + 1} total={5} />
              </td>
            </tr>
          )}
          {review.yield_rating !== null && (
            <tr>
              <td>
                <Label>{t('glossary.yield')}</Label>
              </td>
              <td>
                <Rating score={review.yield_rating + 1} total={5} />
              </td>
            </tr>
          )}
        </tbody>
      </RatingTable>
      <ReviewDescription>
        <blockquote>{review.comment}</blockquote>
        {!editable && (
          <cite>
            {t('review.reviewed_on', {
              date: formatISOString(review.created_at),
            })}
            {review.author && (
              <>
                {' '}
                {t('glossary.by_author')}
                {review.user_id ? (
                  <StyledLink to={`/users/${review.user_id}`}>
                    {review.author}
                  </StyledLink>
                ) : (
                  review.author
                )}
              </>
            )}
            {review.observed_on && (
              <>
                {' '}
                (
                {t('review.visited_on', {
                  date: formatISOString(review.observed_on),
                })}
                )
              </>
            )}
          </cite>
        )}
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
