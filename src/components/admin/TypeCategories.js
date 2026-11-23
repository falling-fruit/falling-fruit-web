import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'
import { CATEGORY_OPTIONS, typeStrings } from './typeStrings'
import { Section, SectionTitle } from './typeStyles'

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-block-end: 0.35em;
  color: ${({ theme }) => theme.secondaryText};
`

const TypeCategories = ({ type, save, isSaving }) => {
  const categories = type.categories ?? []

  const toggle = (value) => {
    const next = categories.includes(value)
      ? categories.filter((category) => category !== value)
      : [...categories, value]
    save({ categories: next })
  }

  return (
    <Section>
      <SectionTitle>{typeStrings.categories.title}</SectionTitle>
      {CATEGORY_OPTIONS.map(({ value, label }) => (
        <CheckboxLabel key={value}>
          <Checkbox
            id={`type-category-${value}`}
            name={value}
            checked={categories.includes(value)}
            disabled={isSaving}
            onChange={() => toggle(value)}
          />
          {label}
        </CheckboxLabel>
      ))}
    </Section>
  )
}

export default TypeCategories
