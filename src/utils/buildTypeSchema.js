import { theme } from '../components/ui/GlobalStyle'

// const getCumulativeCount = (id, countsById, types) => {
//   let count = countsById[id] ? countsById[id] : 0
//   const children = types.filter((t) => t.parent_id === id && t.id !== id)
//   children.forEach(
//     (c) => (count += getCumulativeCount(c.id, countsById, types)),
//   )
//   return count
// }

const getTypesWithRootLabels = (types, countsById, childrenCount) =>
  // TODO: Clean up this if statement logic
  types.map((t) => {
    const count = countsById[t.id] ? countsById[t.id] : 0
    const isParent = childrenCount[t.id] !== count
    if (isParent) {
      // If the type has children, its value should contain the "root" prefix
      return {
        ...t,
        value: `root-${t.id}`,
        pId: t.parent_id ? `root-${t.parent_id}` : 'null',
      }
    } else if (!t.parent_id) {
      // If the type is a root without children
      return {
        ...t,
        value: `${t.id}`,
        pId: 'null',
      }
    } else {
      // If the type is a child, its pId should contain the "root" prefix
      return {
        ...t,
        value: `${t.id}`,
        pId: `root-${t.parent_id}`,
      }
    }
  })

const addOtherCategories = (types, countsById, childrenCount) => {
  const typesWithOtherCategory = [...types]
  types.forEach((t) => {
    const count = countsById[t.id] ? countsById[t.id] : 0
    if (childrenCount[t.id] !== count) {
      typesWithOtherCategory.push({
        ...t,
        value: `${t.id}`,
        pId: `root-${t.id}`,
      })
    }
  })
  return typesWithOtherCategory
}

const sortTypes = (types) =>
  types
    .filter((t) => t.scientific_names.length > 0)
    .sort(
      (a, b) =>
        a.scientific_names[0].localeCompare(b.scientific_names[0]) ||
        a.taxonomic_rank - b.taxonomic_rank,
    )
    .concat(
      types.filter(
        (t) => !t.scientific_names || t.scientific_names.length === 0,
      ),
    )

const buildTypeSchema = (types, showScientificName, countsById, showOnMap) => {
  console.log('rebuilding type schema')
  const startTime = performance.now()

  const childrenCount = {}
  // types.forEach((t) => {
  //   const count = getCumulativeCount(t.id, countsById, types)
  //   childrenCount[t.id] = count
  // })

  const typesOnMap = showOnMap
    ? types.filter((t) => countsById[t.id] > 0)
    : types

  const typesWithRootLabels = getTypesWithRootLabels(
    typesOnMap,
    countsById,
    childrenCount,
  )

  const typesWithOtherCategory = addOtherCategories(
    typesWithRootLabels,
    countsById,
    childrenCount,
  )

  const sortedTypes = sortTypes(typesWithOtherCategory)

  const typeSchema = sortedTypes.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const count =
      childrenCount[type.id] && type.value.includes('root')
        ? childrenCount[type.id]
        : countsById[type.id]
        ? countsById[type.id]
        : 0
    // TODO: Change typeName to span to reuse here
    const name = (
      <span style={{ fontSize: '0.875rem' }}>
        <span
          style={{
            fontWeight: 'bold',
            marginRight: '5px',
            color: theme.secondaryText,
          }}
        >
          {commonName}
        </span>
        {scientificName && showScientificName && (
          <span
            style={{
              fontStyle: 'italic',
              marginRight: '5px',
              color: theme.text,
            }}
          >
            {scientificName}
          </span>
        )}
        <span style={{ fontWeight: 'bold', color: theme.text }}>({count})</span>
      </span>
    )

    return {
      pId: type.pId,
      title: name,
      value: type.value,
      searchValue:
        scientificName && showScientificName
          ? `${commonName} ${scientificName}`
          : `${commonName}`,
    }
  })

  const endTime = performance.now()

  console.log(`finished, took ${endTime - startTime}`)
  return typeSchema
}

export { buildTypeSchema }
