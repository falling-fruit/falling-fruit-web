import styled from 'styled-components/macro'

import Button from '../ui/Button'
import TypeLabel from './TypeLabel'
import { TAXONOMIC_RANK_LABELS, typeStrings } from './typeStrings'
import { plainLabel } from './typeUtils'

const ErrorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25em 0.5em;
  min-width: 0;
  color: ${({ theme }) => theme.red};
  font-size: 0.875rem;
`

const Message = styled.span`
  color: ${({ theme }) => theme.red};
`

export const errorMessage = (error, type, typeById, language) => {
  const { validation } = typeStrings
  const rankLabel = TAXONOMIC_RANK_LABELS[type.taxonomic_rank]
  if (error.code === 'rankNotLower') {
    const parent = typeById.get(error.parentId)
    return validation.rankNotLower(
      rankLabel,
      plainLabel(parent, language),
      TAXONOMIC_RANK_LABELS[parent.taxonomic_rank],
    )
  }
  if (error.code === 'suggestedParent') {
    return validation.suggestedParentTitle(error.name, error.parentName)
  }
  if (error.code === 'missingScientificName') {
    return validation.missingScientificName(
      `${type.taxonomic_rank} (${rankLabel})`,
    )
  }
  if (error.code === 'rankMismatch') {
    return validation.rankMismatch(
      error.name,
      error.shape,
      error.min,
      error.max,
      type.taxonomic_rank,
    )
  }
  return validation[error.code]
}

const ErrorItem = ({
  error,
  message,
  hideMessage,
  typeById,
  language,
  onFix,
  disabled,
}) => (
  <>
    {!hideMessage && <Message>{message}</Message>}
    {(error.fixes ?? []).map((fix) => (
      <Button
        key={JSON.stringify(fix.changes)}
        secondary
        disabled={disabled}
        title={message}
        onClick={() => onFix(fix)}
      >
        {fix.typeId ? (
          <TypeLabel type={typeById.get(fix.typeId)} language={language} />
        ) : (
          typeStrings.validation.setRank(fix.rank)
        )}
      </Button>
    ))}
  </>
)

const TypeErrors = ({ errors, type, typeById, language, onFix, disabled }) => (
  <ErrorList role="alert">
    {errors.map((error) => {
      const message = errorMessage(error, type, typeById, language)
      return (
        <ErrorItem
          key={`${error.code}-${error.parentId ?? ''}`}
          error={error}
          message={message}
          hideMessage={error.code === 'suggestedParent'}
          typeById={typeById}
          language={language}
          onFix={onFix}
          disabled={disabled}
        />
      )
    })}
  </ErrorList>
)

export default TypeErrors
