import { useMemo } from 'react'

import SingleSelect from '../ui/SingleSelect'
import { TAXONOMIC_RANK_LABELS, typeStrings } from './typeStrings'
import { FieldGrid, Section } from './typeStyles'
import {
  compareTypeOptions,
  descendantIds,
  MAX_PARENT_RANK,
  typeOption,
} from './typeUtils'

const rankOptions = TAXONOMIC_RANK_LABELS.map((label, value) => ({
  value,
  label,
}))

const pendingOptions = [
  { value: true, label: typeStrings.settings.yes },
  { value: false, label: typeStrings.settings.no },
]

const TypeSettings = ({
  type,
  types,
  childrenMap,
  language,
  save,
  isSaving,
}) => {
  const parentOptions = useMemo(() => {
    const excluded = descendantIds(type.id, childrenMap)
    excluded.add(type.id)
    return types
      .filter(
        (candidate) =>
          !excluded.has(candidate.id) &&
          (candidate.id === type.parent_id ||
            (candidate.taxonomic_rank ?? 0) <= MAX_PARENT_RANK),
      )
      .map((candidate) => typeOption(candidate, language))
      .sort(compareTypeOptions)
  }, [types, type.id, type.parent_id, childrenMap, language])

  return (
    <Section>
      <FieldGrid>
        <label htmlFor="type-parent">{typeStrings.settings.parent}</label>
        <SingleSelect
          id="type-parent"
          options={parentOptions}
          value={type.parent_id}
          clearable
          disabled={isSaving}
          onChange={(option) => {
            const parentId = option ? option.value : null
            if (parentId !== (type.parent_id ?? null)) {
              save({ parent_id: parentId })
            }
          }}
        />
        <label htmlFor="type-rank">{typeStrings.settings.rank}</label>
        <SingleSelect
          id="type-rank"
          options={rankOptions}
          value={type.taxonomic_rank}
          clearable
          disabled={isSaving}
          onChange={(option) => {
            const rank = option ? option.value : null
            if (rank !== (type.taxonomic_rank ?? null)) {
              save({ taxonomic_rank: rank })
            }
          }}
        />
        <label htmlFor="type-pending">{typeStrings.settings.pending}</label>
        <SingleSelect
          id="type-pending"
          options={pendingOptions}
          value={type.pending}
          disabled={isSaving}
          onChange={(option) => {
            if (option.value !== type.pending) {
              save({ pending: option.value })
            }
          }}
        />
      </FieldGrid>
    </Section>
  )
}

export default TypeSettings
