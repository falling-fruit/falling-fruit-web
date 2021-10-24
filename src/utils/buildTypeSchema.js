import { theme } from '../components/ui/GlobalStyle'

const getChildrenById = (types) => {
  const children = {}
  types.forEach(({ id, parent_id }) => {
    if (id !== parent_id) {
      if (!children[parent_id]) {
        children[parent_id] = [id]
      } else {
        children[parent_id].push(id)
      }
    }
  })
  return children
}

const getTotalCount = (counts, id, childrenById, countsById) => {
  if (id in counts) {
    return counts[id]
  }

  let totalCount = countsById[id] ?? 0
  childrenById[id]?.forEach((childId) => {
    totalCount += getTotalCount(counts, childId, childrenById, countsById)
  })
  counts[id] = totalCount

  return totalCount
}

const getTypesWithRootLabels = (types, childrenById) =>
  // TODO: Clean up this if statement logic
  types.map((t) => {
    const isParent = childrenById[t.id]
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

const addOtherCategories = (types, childrenById) => {
  const typesWithOtherCategory = [...types]
  types.forEach((t) => {
    if (childrenById[t.id]) {
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

// Builds the type tree and sorts on page load
const buildTypeSchema = (types, childrenById) => {
  const typesWithRootLabels = getTypesWithRootLabels(types, childrenById)

  const typesWithOtherCategory = addOtherCategories(
    typesWithRootLabels,
    childrenById,
  )

  const sortedTypes = sortTypes(typesWithOtherCategory)

  const typeSchema = sortedTypes.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]

    return {
      ...type,
      pId: type.pId,
      value: type.value,
      searchValue: scientificName
        ? `${commonName} ${scientificName}`
        : `${commonName}`,
    }
  })

  return typeSchema
}

// Updates cumulative counts and node titles
const updateTreeCounts = (
  treeData,
  showScientificName,
  countsById,
  showOnMap,
  childrenById,
) => {
  console.log('rebuilding type schema')
  const startTime = performance.now()

  const totalCount = {}
  treeData.forEach((t) => {
    getTotalCount(totalCount, t.id, childrenById, countsById)
  })

  const typesOnMap = showOnMap
    ? treeData.filter((t) => countsById[t.id] > 0)
    : treeData

  const typeSchema = typesOnMap.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const count = type.value.includes('root')
      ? totalCount[type.id]
      : countsById[type.id] ?? 0

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
      ...type,
      title: name,
    }
  })

  const endTime = performance.now()

  console.log(`finished, took ${endTime - startTime}`)
  return typeSchema
}

export { buildTypeSchema, getChildrenById, updateTreeCounts }
