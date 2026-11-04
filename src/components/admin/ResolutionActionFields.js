import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { getLocationById } from '../../utils/api'
import Review from '../entry/Review'
import Checkbox from '../ui/Checkbox'
import LoadingIndicator from '../ui/LoadingIndicator'
import SingleSelect from '../ui/SingleSelect'
import {
  adminStrings,
  RESOLUTION_CODE_LABELS,
  resolutionCodeLabel,
} from './adminStrings'
import {
  RESOLUTION_DELETE_PHOTO,
  RESOLUTION_DELETE_REVIEW,
  RESOLUTION_EDIT_LOCATION,
  SINGLE_LOCATION_RESOLUTION_CODES,
} from './resolution'

const Field = styled.div`
  margin-block-end: 1.5em;

  > label {
    display: block;
    margin-block-end: 0.5em;
    font-weight: bold;
  }
`

const ResponseTextarea = styled.textarea`
  width: 100%;
  min-height: 5em;
  font-family: ${({ theme }) => theme.fonts};
  font-size: 1rem;
  padding: 0.5em;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  border-radius: 0.375em;
  box-sizing: border-box;
`

const NotifyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;

  label {
    margin: 0;
    font-weight: normal;
    cursor: pointer;
  }
`

const PhotoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75em;
`

const PhotoChoice = styled.button`
  padding: 0;
  border: 3px solid
    ${({ theme, $selected }) => ($selected ? theme.orange : 'transparent')};
  border-radius: 0.375em;
  background: none;
  cursor: pointer;
  line-height: 0;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 0.25em;
  }
`

const ReviewList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const ReviewChoice = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  margin: 0;
  font-weight: normal;
  cursor: pointer;

  > div:last-child {
    flex: 1;
  }
`

const AttestationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;

  label {
    margin: 0;
    font-weight: normal;
    cursor: pointer;
  }
`

const EditLocationLink = styled.a`
  font-weight: normal;
`

const buildResolutionActionOptions = ({
  singleLocation,
  hasPhotos = true,
  hasReviews = true,
}) =>
  Array.from({ length: RESOLUTION_CODE_LABELS.length }, (_, code) => ({
    value: code,
    label: resolutionCodeLabel(code),
    isDisabled:
      (!singleLocation && SINGLE_LOCATION_RESOLUTION_CODES.includes(code)) ||
      (code === RESOLUTION_DELETE_PHOTO && !hasPhotos) ||
      (code === RESOLUTION_DELETE_REVIEW && !hasReviews),
  }))

const ResolutionActionFields = ({
  code,
  onCodeChange,
  response,
  onResponseChange,
  notifyReporters,
  onNotifyReportersChange,
  photoId,
  onPhotoIdChange,
  reviewIds,
  onReviewIdsChange,
  editAttested,
  onEditAttestedChange,
  singleLocationId,
  hasReporters,
}) => {
  const [locationDetails, setLocationDetails] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  const needsLocationDetails = singleLocationId != null

  useEffect(() => {
    if (!needsLocationDetails) {
      setLocationDetails(null)
      return
    }
    let cancelled = false
    const fetchDetails = async () => {
      setIsLoadingDetails(true)
      try {
        const details = await getLocationById(singleLocationId, 'reviews')
        if (!cancelled) {
          setLocationDetails(details)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDetails(false)
        }
      }
    }
    fetchDetails()
    return () => {
      cancelled = true
    }
  }, [needsLocationDetails, singleLocationId])

  const reviews = locationDetails?.reviews ?? []
  const photos = reviews.flatMap((review) =>
    (review.photos ?? []).map((photo) => ({ photo, review })),
  )

  const options = buildResolutionActionOptions({
    singleLocation: singleLocationId != null,
    hasPhotos: locationDetails == null || photos.length > 0,
    hasReviews: locationDetails == null || reviews.length > 0,
  })

  useEffect(() => {
    const selected = options.find((option) => option.value === code)
    if (code != null && selected?.isDisabled) {
      onCodeChange(null)
    }
  }, [code, options, onCodeChange])

  return (
    <>
      <Field>
        <label htmlFor="resolution-code-select">
          {adminStrings.resolve.resolutionCodeLabel}
        </label>
        <SingleSelect
          id="resolution-code-select"
          options={options}
          value={code}
          onChange={(option) => onCodeChange(option ? option.value : null)}
        />
      </Field>

      {(code === RESOLUTION_DELETE_PHOTO ||
        code === RESOLUTION_DELETE_REVIEW) &&
        isLoadingDetails && (
          <Field>
            <LoadingIndicator />
          </Field>
        )}

      {code === RESOLUTION_EDIT_LOCATION && singleLocationId != null && (
        <Field>
          <label>{adminStrings.resolve.editLocationLabel}</label>
          <AttestationRow>
            <Checkbox
              id="edit-attested"
              checked={!!editAttested}
              onChange={(e) => onEditAttestedChange(e.target.checked)}
            />
            <label htmlFor="edit-attested">
              {adminStrings.resolve.editAttestation}
            </label>
          </AttestationRow>
          <EditLocationLink
            href={`/locations/${singleLocationId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onEditAttestedChange(true)}
          >
            {adminStrings.resolve.editLocationLink}
          </EditLocationLink>
        </Field>
      )}

      {code === RESOLUTION_DELETE_PHOTO && locationDetails && (
        <Field>
          <label>{adminStrings.resolve.selectPhoto}</label>
          {photos.length === 0 ? (
            <p>{adminStrings.resolve.noPhotos}</p>
          ) : (
            <PhotoGrid>
              {photos.map(({ photo }) => (
                <PhotoChoice
                  key={photo.id}
                  type="button"
                  $selected={photoId === photo.id}
                  onClick={() => onPhotoIdChange(photo.id)}
                  aria-pressed={photoId === photo.id}
                >
                  <img src={photo.medium} alt={`#${photo.id}`} />
                </PhotoChoice>
              ))}
            </PhotoGrid>
          )}
        </Field>
      )}

      {code === RESOLUTION_DELETE_REVIEW && locationDetails && (
        <Field>
          <label>{adminStrings.resolve.selectReview}</label>
          {reviews.length === 0 ? (
            <p>{adminStrings.resolve.noReviews}</p>
          ) : (
            <ReviewList>
              {reviews.map((review) => (
                <li key={review.id}>
                  <ReviewChoice>
                    <Checkbox
                      checked={(reviewIds ?? []).includes(review.id)}
                      onChange={(e) =>
                        onReviewIdsChange(
                          e.target.checked
                            ? [...(reviewIds ?? []), review.id]
                            : (reviewIds ?? []).filter(
                                (id) => id !== review.id,
                              ),
                        )
                      }
                      aria-label={`Select review #${review.id} to delete`}
                    />
                    <Review review={review} includePreview />
                  </ReviewChoice>
                </li>
              ))}
            </ReviewList>
          )}
        </Field>
      )}

      <Field>
        <label htmlFor="resolution-response">
          {adminStrings.resolve.responseLabel}
        </label>
        <ResponseTextarea
          id="resolution-response"
          value={response}
          placeholder={adminStrings.resolve.responsePlaceholder}
          onChange={(e) => onResponseChange(e.target.value)}
        />
      </Field>

      {hasReporters && (
        <Field>
          <NotifyRow>
            <Checkbox
              id="notify-reporters"
              checked={notifyReporters}
              onChange={(e) => onNotifyReportersChange(e.target.checked)}
            />
            <label htmlFor="notify-reporters">
              {adminStrings.resolve.notifyReporters}
            </label>
          </NotifyRow>
        </Field>
      )}
    </>
  )
}

export default ResolutionActionFields
