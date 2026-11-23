import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import Button from '../ui/Button'
import TypeForm from './TypeForm'
import TypePicker from './TypePicker'
import { typeStrings } from './typeStrings'
import { FieldGrid, Muted, Section, SectionTitle } from './typeStyles'
import { ancestorIds, descendantIds, hasRequiredName } from './typeUtils'

const BackLink = styled(Link)`
  display: inline-block;
  margin-block-end: 0.75em;
  font-size: 0.9rem;
`

const Title = styled.h2`
  margin-block: 0 0.75em;
  font-size: 1.5rem !important;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75em;
`

const DEFAULT_CATEGORIES = ['forager', 'freegan']

const emptyDraft = (parentId) => ({
  parent_id: parentId,
  pending: false,
  taxonomic_rank: null,
  scientific_names: [],
  common_names: {},
  categories: [...DEFAULT_CATEGORIES],
  edibility: null,
  urls: {},
  notes: null,
})

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0)

const toPayload = (draft) =>
  Object.fromEntries(
    Object.entries(draft).filter(
      ([key, value]) => key === 'pending' || !isEmpty(value),
    ),
  )

const NewTypeForm = ({
  typeOptions,
  typeById,
  childrenMap,
  language,
  initialParentId,
  initialChildIds,
  onCreate,
  onCancel,
}) => {
  const [draft, setDraft] = useState(() => emptyDraft(initialParentId))
  const [childIds, setChildIds] = useState(initialChildIds)
  const [isSaving, setIsSaving] = useState(false)

  const save = useCallback((changes) => {
    setDraft((previous) => ({ ...previous, ...changes }))
    return Promise.resolve(true)
  }, [])

  const extraExcludedParentIds = useMemo(() => {
    const excluded = new Set(childIds)
    childIds.forEach((id) =>
      descendantIds(id, childrenMap).forEach((descendant) =>
        excluded.add(descendant),
      ),
    )
    return excluded
  }, [childIds, childrenMap])

  const excludedChildIds = useMemo(() => {
    const excluded = new Set()
    if (draft.parent_id) {
      excluded.add(draft.parent_id)
      ancestorIds(draft.parent_id, typeById).forEach((id) => excluded.add(id))
    }
    return excluded
  }, [draft.parent_id, typeById])

  const handleCreate = async () => {
    setIsSaving(true)
    try {
      await onCreate(toPayload(draft), childIds)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <BackLink to="/admin/types">
        {typeStrings.details.backToOverview}
      </BackLink>
      <Title>{typeStrings.create.title}</Title>
      <Section>
        <SectionTitle>
          <label htmlFor="type-new-children">
            {typeStrings.create.children}
          </label>
        </SectionTitle>
        <FieldGrid $columns="minmax(14em, 40em)">
          <TypePicker
            inputId="type-new-children"
            options={typeOptions}
            excludedIds={excludedChildIds}
            value={childIds}
            language={language}
            isMulti
            disabled={isSaving}
            onChange={setChildIds}
          />
        </FieldGrid>
      </Section>
      <TypeForm
        type={draft}
        typeOptions={typeOptions}
        typeById={typeById}
        childrenMap={childrenMap}
        extraExcludedParentIds={extraExcludedParentIds}
        errors={[]}
        language={language}
        save={save}
        isSaving={isSaving}
      />
      <ButtonRow>
        <Button
          onClick={handleCreate}
          disabled={isSaving || !hasRequiredName(draft)}
        >
          {typeStrings.create.button}
        </Button>
        <Button secondary onClick={onCancel} disabled={isSaving}>
          {typeStrings.create.cancel}
        </Button>
      </ButtonRow>
      {!hasRequiredName(draft) && (
        <Muted>{typeStrings.create.nameRequired}</Muted>
      )}
    </div>
  )
}

export default NewTypeForm
