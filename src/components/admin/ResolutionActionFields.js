import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { getLocationById } from '../../utils/api'
import Review from '../entry/Review'
import { formatISOString } from '../entry/textFormatters'
import Checkbox from '../ui/Checkbox'
import LoadingIndicator from '../ui/LoadingIndicator'
import SingleSelect from '../ui/SingleSelect'
import {
  reportStrings,
  RESOLUTION_CODE_LABELS,
  resolutionCodeLabel,
} from './reportStrings'
import {
  RESOLUTION_DELETE_LOCATION,
  RESOLUTION_DELETE_PHOTO,
  RESOLUTION_DELETE_REVIEW,
  RESOLUTION_EDIT_LOCATION,
  RESOLUTION_HIDE_LOCATION,
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

const LocationSummary = styled.p`
  margin-block: 0 1.5em;
  color: ${({ theme }) => theme.secondaryText};
`

const Note = styled.p`
  margin-block: 0.5em 0;
  color: ${({ theme }) => theme.tertiaryText};
  font-style: italic;
`

const summaryParts = (details, photoCount, language) => {
  const strings = reportStrings.resolve.locationSummary
  const sameDay =
    details.updated_at == null ||
    details.created_at.slice(0, 10) === details.updated_at.slice(0, 10)
  return [
    strings.created(formatISOString(details.created_at, language)),
    ...(sameDay
      ? []
      : [strings.edited(formatISOString(details.updated_at, language))]),
    strings.reviews((details.reviews ?? []).length),
    strings.photos(photoCount),
  ]
}

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
  const { i18n } = useTranslation()
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
      {locationDetails && (
        <LocationSummary>
          {summaryParts(locationDetails, photos.length, i18n.language).join(
            ' · ',
          )}
        </LocationSummary>
      )}
      <Field>
        <label htmlFor="resolution-code-select">
          {reportStrings.resolve.resolutionCodeLabel}
        </label>
        <SingleSelect
          id="resolution-code-select"
          options={options}
          value={code}
          onChange={(option) => onCodeChange(option ? option.value : null)}
        />
        {code === RESOLUTION_DELETE_LOCATION && (
          <Note>{reportStrings.resolve.deleteLocationNote}</Note>
        )}
        {code === RESOLUTION_HIDE_LOCATION && (
          <Note>{reportStrings.resolve.hideLocationNote}</Note>
        )}
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
          <label>{reportStrings.resolve.editLocationLabel}</label>
          <AttestationRow>
            <Checkbox
              id="edit-attested"
              checked={!!editAttested}
              onChange={(e) => onEditAttestedChange(e.target.checked)}
            />
            <label htmlFor="edit-attested">
              {reportStrings.resolve.editAttestation}
            </label>
          </AttestationRow>
          <EditLocationLink
            href={`/locations/${singleLocationId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onEditAttestedChange(true)}
          >
            {reportStrings.resolve.editLocationLink}
          </EditLocationLink>
        </Field>
      )}

      {code === RESOLUTION_DELETE_PHOTO && locationDetails && (
        <Field>
          <label>{reportStrings.resolve.selectPhoto}</label>
          {photos.length === 0 ? (
            <p>{reportStrings.resolve.noPhotos}</p>
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
          <label>{reportStrings.resolve.selectReview}</label>
          {reviews.length === 0 ? (
            <p>{reportStrings.resolve.noReviews}</p>
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
          {reportStrings.resolve.responseLabel}
        </label>
        <ResponseTextarea
          id="resolution-response"
          value={response}
          placeholder={reportStrings.resolve.responsePlaceholder}
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
              {reportStrings.resolve.notifyReporters}
            </label>
          </NotifyRow>
        </Field>
      )}
    </>
  )
}

export default ResolutionActionFields
