import SingleSelect from '../ui/SingleSelect'
import { EDIBILITY_OPTIONS, typeStrings } from './typeStrings'
import { FieldGrid, Section, SectionTitle } from './typeStyles'

const TypeEdibility = ({ type, save, isSaving }) => {
  const current = type.edibility ?? null
  const options =
    current && !EDIBILITY_OPTIONS.some((option) => option.value === current)
      ? [...EDIBILITY_OPTIONS, { value: current, label: current }]
      : EDIBILITY_OPTIONS

  return (
    <Section>
      <SectionTitle>
        <label htmlFor="type-edibility">{typeStrings.edibility.title}</label>
      </SectionTitle>
      <FieldGrid $columns="minmax(14em, 28em)">
        <SingleSelect
          id="type-edibility"
          options={options}
          value={current}
          clearable
          disabled={isSaving}
          onChange={(option) => {
            const next = option ? option.value : null
            if (next !== current) {
              save({ edibility: next })
            }
          }}
        />
      </FieldGrid>
    </Section>
  )
}

export default TypeEdibility
