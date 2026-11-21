import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { editType, getTypeById } from '../../utils/api'
import Button from '../ui/Button'
import { ScientificName } from '../ui/TypeName'
import TypeActions from './TypeActions'
import TypeCategories from './TypeCategories'
import TypeEdibility from './TypeEdibility'
import TypeExampleLocations from './TypeExampleLocations'
import TypeLinksTable from './TypeLinksTable'
import TypeNamesTable from './TypeNamesTable'
import TypeNotes from './TypeNotes'
import TypeSettings from './TypeSettings'
import { TAXONOMIC_RANK_LABELS, typeStrings } from './typeStrings'
import { Muted } from './typeStyles'
import { labelParts, plainLabel, typeOption } from './typeUtils'

const BackLink = styled(Link)`
  display: inline-block;
  margin-block-end: 0.75em;
  font-size: 0.9rem;
`

const ErrorBanner = styled.div`
  margin-block-end: 1em;
  padding: 0.75em 1em;
  border: 1px solid ${({ theme }) => theme.red};
  border-radius: 0.375em;
  color: ${({ theme }) => theme.red};
  background: ${({ theme }) => theme.secondaryBackground};
  font-size: 0.9rem;

  ul {
    margin: 0.25em 0 0;
    padding-inline-start: 1.25em;
  }
`

const FixButton = styled(Button)`
  margin-inline-start: 0.5em;
`

const Title = styled.h2`
  margin-block: 0 0.25em;
  font-size: 1.5rem !important;
`

const Meta = styled.p`
  margin-block: 0 0.25em;
  font-size: 0.9rem !important;
`

const Pending = styled.span`
  color: ${({ theme }) => theme.orange};
`

const TypeDetails = ({
  typeId,
  types,
  typeById,
  childrenMap,
  counts,
  errors,
  language,
  onTypeChange,
  onStructureChange,
}) => {
  const [type, setType] = useState(null)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isCancelled = false
    getTypeById(typeId)
      .then((fetched) => !isCancelled && setType(fetched))
      .catch((fetchError) => !isCancelled && setError(fetchError.message))
    return () => {
      isCancelled = true
    }
  }, [typeId])

  const listedParentId = typeById.get(typeId)?.parent_id
  useEffect(() => {
    setType((previous) =>
      previous && previous.parent_id !== listedParentId
        ? { ...previous, parent_id: listedParentId }
        : previous,
    )
  }, [listedParentId])

  if (error) {
    return <p>{typeStrings.details.loadFailed(error)}</p>
  }

  if (!type) {
    return <p>{typeStrings.details.loading}</p>
  }

  const save = async (changes) => {
    setIsSaving(true)
    try {
      const updated = await editType(type.id, changes)
      setType(updated)
      onTypeChange(updated)
      return true
    } catch (saveError) {
      toast.error(typeStrings.details.saveFailed(saveError.message))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const count = counts.get(type.id) ?? 0
  const children = childrenMap.get(type.id) ?? []
  const childrenLocations = children.reduce(
    (sum, child) => sum + (counts.get(child.id) ?? 0),
    0,
  )
  const { common, botanical, cultivar } = labelParts(type, language)

  const errorMessage = (validationError) => {
    const { validation } = typeStrings
    const rankLabel = TAXONOMIC_RANK_LABELS[type.taxonomic_rank]
    if (validationError.code === 'rankNotLower') {
      const parent = typeById.get(validationError.parentId)
      return validation.rankNotLower(
        rankLabel,
        plainLabel(parent, language),
        TAXONOMIC_RANK_LABELS[parent.taxonomic_rank],
      )
    }
    if (validationError.code === 'suggestedParent') {
      return validation.suggestedParent(
        validationError.name,
        validationError.parentName,
      )
    }
    if (validationError.code === 'missingScientificName') {
      return validation.missingScientificName(
        `${type.taxonomic_rank} (${rankLabel})`,
      )
    }
    if (validationError.code === 'rankMismatch') {
      return validation.rankMismatch(
        validationError.name,
        validationError.shape,
        validationError.min,
        validationError.max,
        type.taxonomic_rank,
      )
    }
    return validation[validationError.code]
  }
  return (
    <div>
      <BackLink to="/admin/types">
        {typeStrings.details.backToOverview}
      </BackLink>
      {errors && errors.length > 0 && (
        <ErrorBanner role="alert">
          <strong>{typeStrings.validation.title}</strong>
          <ul>
            {errors.map((validationError) => (
              <li
                key={`${validationError.code}-${validationError.parentId ?? ''}`}
              >
                {errorMessage(validationError)}
                {validationError.code === 'suggestedParent' &&
                  validationError.parentIds.map((parentId) => (
                    <FixButton
                      key={parentId}
                      secondary
                      disabled={isSaving}
                      onClick={() => save({ parent_id: parentId })}
                    >
                      {typeStrings.validation.setParent(
                        typeOption(typeById.get(parentId), language).label,
                      )}
                    </FixButton>
                  ))}
              </li>
            ))}
          </ul>
        </ErrorBanner>
      )}
      <Title>
        {common}
        {common && (botanical || cultivar) && ' '}
        <ScientificName botanical={botanical} cultivar={cultivar} />
        {!common && !botanical && !cultivar && typeStrings.details.unnamed}
      </Title>
      <Meta>
        <Muted>{typeStrings.details.idLabel(type.id)}</Muted>
        {' · '}
        {typeStrings.details.locationCount(count)}
        {type.pending && (
          <Pending>
            {' · '}
            {typeStrings.tree.pendingMarker} {typeStrings.tree.pendingTitle}
          </Pending>
        )}
      </Meta>
      {children.length > 0 && (
        <Meta>
          {typeStrings.details.childrenInfo(children.length, childrenLocations)}
        </Meta>
      )}
      <br />
      <TypeActions
        type={type}
        types={types}
        typeById={typeById}
        childrenMap={childrenMap}
        count={count}
        language={language}
        onStructureChange={onStructureChange}
      />
      <TypeSettings
        type={type}
        types={types}
        childrenMap={childrenMap}
        language={language}
        save={save}
        isSaving={isSaving}
      />
      <TypeNotes type={type} save={save} isSaving={isSaving} />
      <TypeExampleLocations typeId={type.id} count={count} />
      <TypeNamesTable type={type} save={save} isSaving={isSaving} />
      <TypeLinksTable type={type} save={save} isSaving={isSaving} />
      <TypeEdibility type={type} save={save} isSaving={isSaving} />
      <TypeCategories type={type} save={save} isSaving={isSaving} />
    </div>
  )
}

export default TypeDetails
