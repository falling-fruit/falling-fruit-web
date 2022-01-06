import { Pencil as PencilIcon } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import { FRUITING_RATINGS, RATINGS } from '../../constants/ratings'
import ImagePreview from '../ui/ImagePreview'
import Rating from '../ui/Rating'
import ResetButton from '../ui/ResetButton'
import { formatISOString } from './textFormatters'

const ReviewContainer = styled.div`
  margin-bottom: 20px;

  ${({ $editable, theme }) =>
    $editable &&
    `
    background: ${theme.navBackground};
    padding: 0.6em;
    margin-bottom: calc(20px - 0.6em);
    border-radius: 8px;
  `}
`
const Label = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.tertiaryText};
  margin: 3px 0px;
`
const RatingTable = styled.table`
  width: 100%;
  margin-bottom: 6px;
  border-spacing: 0;
  line-height: 1.66;

  td:nth-child(2) {
    width: 100%;
    text-align: right;
  }
  td {
    padding: 0;
  }
`
const ReviewDescription = styled.section`
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

const Review = ({
  review,
  onImageClick,
  includePreview = true,
  editable = false,
}) => (
  <ReviewContainer $editable={editable}>
    {editable && (
      <EditableHeader>
        You reviewed this location on {formatISOString(review.created_at)}{' '}
        <ResetButton>
          <PencilIcon height={14} /> Update or delete this review.
        </ResetButton>
      </EditableHeader>
    )}
    <RatingTable>
      <tbody>
        {RATINGS.map(({ title, ratingKey, total }, key) => {
          const score = review[ratingKey]

          if (!score) {
            return null
          }

          return (
            <tr key={key}>
              <td>
                <Label>{title}</Label>
              </td>
              <td>
                {ratingKey !== 'fruiting' ? (
                  <Rating key={key} score={review[ratingKey]} total={total} />
                ) : (
                  FRUITING_RATINGS[score]
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </RatingTable>
    <ReviewDescription>
      <blockquote>{review.comment}</blockquote>
      {!editable && (
        <cite>
          Reviewed {formatISOString(review.created_at)} by{' '}
          {review.author ?? 'Anonymous'}
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

export default Review
