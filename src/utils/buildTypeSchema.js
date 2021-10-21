const getCumulativeCount = (id, countsById, types) => {
  let count = countsById[id] ? countsById[id] : 0
  const children = types.filter((t) => t.parent_id === id && t.id !== id)
  children.forEach(
    (c) => (count += getCumulativeCount(c.id, countsById, types)),
  )
  return count
}

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

const buildTypeSchema = (
  types,
  showScientificName,
  countsById,
  showPositiveCounts,
) => {
  const childrenCount = {}
  types.forEach((t) => {
    const count = getCumulativeCount(t.id, countsById, types)
    childrenCount[t.id] = count
  })

  const typesWithPositiveCounts = showPositiveCounts
    ? types.filter((t) => countsById[t.id] > 0)
    : types

  const typesWithRootLabels = getTypesWithRootLabels(
    typesWithPositiveCounts,
    countsById,
    childrenCount,
  )

  const typesWithOtherCategory = addOtherCategories(
    typesWithRootLabels,
    countsById,
    childrenCount,
  )

  const sortedTypes = sortTypes(typesWithOtherCategory)

  return sortedTypes.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const name =
      scientificName && showScientificName
        ? `${commonName} [${scientificName}]`
        : commonName
    const count =
      childrenCount[type.id] && type.value.includes('root')
        ? childrenCount[type.id]
        : countsById[type.id]
        ? countsById[type.id]
        : 0

    return {
      pId: type.pId,
      title: `${name} (${count})`,
      value: type.value,
    }
  })
}

export { buildTypeSchema }
