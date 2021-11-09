const PENDING_ID = 'PENDING'

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

const getTypesWithPendingCategory = (types) => {
  const typesWithPendingCategory = [
    ...types,
    {
      id: PENDING_ID,
      parent_id: null,
      name: 'Pending Review',
    },
  ]
  typesWithPendingCategory.forEach((t) => {
    if (t.pending) {
      t.parent_id = PENDING_ID
    }
  })
  return typesWithPendingCategory
}

const getTypesWithRootLabels = (types, childrenById) =>
  types.map((t) => {
    const isParent = childrenById[t.id]
    return {
      ...t,
      value: isParent ? `root-${t.id}` : `${t.id}`,
      pId: t.parent_id ? `root-${t.parent_id}` : 'null',
    }
  })

const addOtherCategories = (types, childrenById) => {
  const typesWithOtherCategory = [...types]
  types.forEach((t) => {
    if (childrenById[t.id] && t.id !== PENDING_ID) {
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
    .filter((t) => t.scientific_names?.length > 0)
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

// Builds and sorts the type tree on page load
const buildTypeSchema = (types, childrenById) => {
  const typesWithRootLabels = getTypesWithRootLabels(types, childrenById)

  const typesWithOtherCategory = addOtherCategories(
    typesWithRootLabels,
    childrenById,
  )

  const sortedTypes = sortTypes(typesWithOtherCategory)

  return sortedTypes.map((type) => {
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
}

// Updates cumulative counts and node titles in the type tree
const updateTreeCounts = (
  treeData,
  showScientificName,
  countsById,
  showOnlyOnMap,
  childrenById,
) => {
  const totalCount = {}
  treeData.forEach((t) => {
    getTotalCount(totalCount, t.id, childrenById, countsById)
  })

  const typeSchema = treeData.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const cultivarIndex = scientificName?.indexOf("'")
    const shouldIncludeScientificName = scientificName && showScientificName
    const count = type.value.includes('root')
      ? totalCount[type.id]
      : countsById[type.id] ?? 0

    const name = (
      <span className="tree-node-text">
        <span className="tree-node-common-name">{commonName}</span>
        {shouldIncludeScientificName && (
          <span className="tree-node-scientific-name">
            {cultivarIndex === -1
              ? scientificName
              : scientificName.substring(cultivarIndex)}
          </span>
        )}
        <span className="tree-node-count">({count})</span>
      </span>
    )

    return {
      ...type,
      title: name,
      count,
    }
  })

  return showOnlyOnMap ? typeSchema.filter((t) => t.count > 0) : typeSchema
}

export {
  buildTypeSchema,
  getChildrenById,
  getTypesWithPendingCategory,
  PENDING_ID,
  updateTreeCounts,
}
