import TreeNodeText from '../components/filter/TreeNodeText'

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

const getScientificNameById = (types) => {
  const scientificNameById = {}
  types.forEach((t) => {
    if (t.scientific_names) {
      scientificNameById[t.id] = t.scientific_names[0]
    }
  })
  return scientificNameById
}

const getTotalCount = (counts, id, childrenById, countsById) => {
  if (id in counts) {
    return counts[id]
  }
  counts[id] = countsById[id] ?? 0
  childrenById[id]?.forEach((childId) => {
    counts[id] += getTotalCount(counts, childId, childrenById, countsById)
  })
  return counts[id]
}

const getTypesWithPendingCategory = (types) =>
  types.map((t) => ({
    ...t,
    parent_id: t.pending ? PENDING_ID : t.parent_id,
  }))

const getTypesWithRootLabels = (types, childrenById) =>
  types.map((t) => {
    const { id, parent_id } = t
    const isParent = childrenById[id]
    return {
      ...t,
      value: isParent ? `root-${id}` : `${id}`,
      pId: parent_id ? `root-${parent_id}` : 'null',
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

const getNames = (type) => {
  const commonName = type.name ?? type.common_names.en[0]
  const scientificName = type.scientific_names?.[0]
  return {
    commonName,
    scientificName,
  }
}

// Builds and sorts the type tree on page load
const buildTypeSchema = (types, childrenById) => {
  const typesWithRootLabels = getTypesWithRootLabels(types, childrenById)

  const typesWithOtherCategory = addOtherCategories(
    typesWithRootLabels,
    childrenById,
  )

  const sortedTypes = sortTypes(typesWithOtherCategory)

  return sortedTypes.map((type) => {
    const { commonName, scientificName } = getNames(type)

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
  countsById,
  showOnlyOnMap,
  childrenById,
  scientificNameById,
) => {
  const totalCount = {}
  treeData.forEach((t) => {
    getTotalCount(totalCount, t.id, childrenById, countsById)
  })

  const typeSchema = treeData.map((type) => {
    const { commonName, scientificName } = getNames(type)
    const parentScientificName = scientificNameById[type.parent_id]
    const cultivarIndex =
      scientificName?.startsWith(`${parentScientificName} '`) &&
      scientificName?.indexOf("'")
    const count = type.value.includes('root')
      ? totalCount[type.id]
      : countsById[type.id] ?? 0

    return {
      ...type,
      title: (
        <TreeNodeText
          commonName={commonName}
          shouldIncludeScientificName={scientificName}
          shouldIncludeCommonName={!cultivarIndex}
          scientificName={
            cultivarIndex === -1
              ? scientificName
              : scientificName?.substring(cultivarIndex)
          }
          count={count}
        />
      ),
      count,
    }
  })

  return showOnlyOnMap ? typeSchema.filter((t) => t.count > 0) : typeSchema
}

export {
  buildTypeSchema,
  getChildrenById,
  getScientificNameById,
  getTypesWithPendingCategory,
  PENDING_ID,
  updateTreeCounts,
}
