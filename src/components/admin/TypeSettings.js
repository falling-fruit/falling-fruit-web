import { useMemo } from 'react'

import LabeledCheckbox from '../filter/LabeledCheckbox'
import SingleSelect from '../ui/SingleSelect'
import TypeErrors from './TypeErrors'
import TypePicker from './TypePicker'
import { TAXONOMIC_RANK_LABELS, typeStrings } from './typeStrings'
import { FieldGrid, Section } from './typeStyles'
import { descendantIds, errorsForField, MAX_PARENT_RANK } from './typeUtils'

const rankOptions = TAXONOMIC_RANK_LABELS.map((label, value) => ({
  value,
  label,
}))

const EmptyCell = () => <span />

const TypeSettings = ({
  type,
  typeOptions,
  typeById,
  childrenMap,
  extraExcludedParentIds,
  errors,
  language,
  save,
  isSaving,
}) => {
  const excludedParentIds = useMemo(() => {
    const excluded = descendantIds(type.id, childrenMap)
    excluded.add(type.id)
    extraExcludedParentIds?.forEach((id) => excluded.add(id))
    typeOptions.forEach((option) => {
      if (
        option.value !== type.parent_id &&
        option.taxonomicRank > MAX_PARENT_RANK
      ) {
        excluded.add(option.value)
      }
    })
    return excluded
  }, [
    typeOptions,
    type.id,
    type.parent_id,
    childrenMap,
    extraExcludedParentIds,
  ])

  const renderErrors = (field) => {
    const fieldErrors = errorsForField(errors, field)
    return fieldErrors.length > 0 ? (
      <TypeErrors
        errors={fieldErrors}
        type={type}
        typeById={typeById}
        language={language}
        disabled={isSaving}
        onFix={(fix) => save(fix.changes)}
      />
    ) : (
      <EmptyCell />
    )
  }

  return (
    <Section>
      <FieldGrid>
        <label htmlFor="type-parent">{typeStrings.settings.parent}</label>
        <TypePicker
          inputId="type-parent"
          options={typeOptions}
          excludedIds={excludedParentIds}
          value={type.parent_id ?? null}
          language={language}
          clearable
          disabled={isSaving}
          onChange={(parentId) => {
            if (parentId !== (type.parent_id ?? null)) {
              save({ parent_id: parentId })
            }
          }}
        />
        {renderErrors('parent_id')}
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
        {renderErrors('taxonomic_rank')}
        <EmptyCell />
        <LabeledCheckbox
          field="type-pending"
          value={Boolean(type.pending)}
          disabled={isSaving}
          onChange={(pending) => save({ pending })}
          label={typeStrings.settings.pending}
        />
        <EmptyCell />
      </FieldGrid>
    </Section>
  )
}

export default TypeSettings
