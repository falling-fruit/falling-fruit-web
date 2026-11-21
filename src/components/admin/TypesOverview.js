import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'
import { typeStrings } from './typeStrings'
import { Section, SectionTitle } from './typeStyles'
import { plainLabel } from './typeUtils'

const Hint = styled.p`
  font-size: 1.1rem !important;
  margin-block: 0 1.5em;
`

const StatList = styled.dl`
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 0.35em 2em;
  margin: 0;

  dt {
    color: ${({ theme }) => theme.secondaryText};
  }

  dd {
    margin: 0;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
  }
`

const StatRow = styled.div`
  display: contents;
`

const TopList = styled.ol`
  margin: 0;
  padding-inline-start: 1.5em;
`

const TopButton = styled(ResetButton)`
  color: ${({ theme }) => theme.blue};
  text-align: start;

  &:hover {
    text-decoration: underline;
  }
`

const TOP_TYPES_COUNT = 10

const TypesOverview = ({ types, typeById, counts, language, onSelect }) => {
  const totalLocations = [...counts.values()].reduce((sum, n) => sum + n, 0)
  const withLocations = types.filter((type) => counts.get(type.id) > 0).length
  const topLevel = types.filter(
    (type) => !type.parent_id || !typeById.has(type.parent_id),
  ).length
  const topTypes = [...types]
    .filter((type) => counts.get(type.id) > 0)
    .sort((a, b) => counts.get(b.id) - counts.get(a.id))
    .slice(0, TOP_TYPES_COUNT)

  const stats = [
    [typeStrings.overview.totalTypes, types.length],
    [typeStrings.overview.topLevelTypes, topLevel],
    [
      typeStrings.overview.pendingTypes,
      types.filter((type) => type.pending).length,
    ],
    [typeStrings.overview.typesWithLocations, withLocations],
    [typeStrings.overview.typesWithoutLocations, types.length - withLocations],
    [typeStrings.overview.totalLocations, totalLocations],
  ]

  return (
    <>
      <Hint>{typeStrings.overview.hint}</Hint>
      <Section>
        <SectionTitle>{typeStrings.overview.title}</SectionTitle>
        <StatList>
          {stats.map(([label, value]) => (
            <StatRow key={label}>
              <dt>{label}</dt>
              <dd>{value.toLocaleString()}</dd>
            </StatRow>
          ))}
        </StatList>
      </Section>
      <Section>
        <SectionTitle>{typeStrings.overview.topTypes}</SectionTitle>
        <TopList>
          {topTypes.map((type) => (
            <li key={type.id}>
              <TopButton onClick={() => onSelect(type.id)}>
                {plainLabel(type, language)}
              </TopButton>{' '}
              <strong>{counts.get(type.id).toLocaleString()}</strong>
            </li>
          ))}
        </TopList>
      </Section>
    </>
  )
}

export default TypesOverview
