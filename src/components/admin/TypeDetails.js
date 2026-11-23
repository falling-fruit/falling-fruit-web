import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { editType, getTypeById } from '../../utils/api'
import TypeActions from './TypeActions'
import TypeErrors from './TypeErrors'
import TypeExampleLocations from './TypeExampleLocations'
import TypeForm from './TypeForm'
import TypeLabel from './TypeLabel'
import { typeStrings } from './typeStrings'
import { Muted } from './typeStyles'
import { labelParts, unattachedErrors } from './typeUtils'

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
  typeOptions,
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
  const bannerErrors = unattachedErrors(errors)

  return (
    <div>
      <BackLink to="/admin/types">
        {typeStrings.details.backToOverview}
      </BackLink>
      {bannerErrors.length > 0 && (
        <ErrorBanner>
          <strong>{typeStrings.validation.title}</strong>
          <TypeErrors
            errors={bannerErrors}
            type={type}
            typeById={typeById}
            language={language}
            disabled={isSaving}
            onFix={(fix) => save(fix.changes)}
          />
        </ErrorBanner>
      )}
      <Title>
        <TypeLabel type={type} language={language} />
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
        typeOptions={typeOptions}
        typeById={typeById}
        childrenMap={childrenMap}
        count={count}
        language={language}
        onStructureChange={onStructureChange}
      />
      <TypeForm
        type={type}
        typeOptions={typeOptions}
        typeById={typeById}
        childrenMap={childrenMap}
        errors={errors}
        language={language}
        save={save}
        isSaving={isSaving}
      />
      <TypeExampleLocations typeId={type.id} count={count} />
    </div>
  )
}

export default TypeDetails
