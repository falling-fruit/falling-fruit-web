import TreeNodeText from '../components/filter/TreeNodeText'

const PENDING_ID = 'PENDING'
const RC_ROOT_ID = 'RC_ROOT'

const getChildrenById = (types) => {
  const children = {}
  types.forEach(({ id, parent_id }) => {
    if (parent_id && id !== parent_id) {
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
  const commonName = type.name ?? type.common_names.en?.[0]
  const scientificName = type.scientific_names?.[0]
  return {
    commonName,
    scientificName,
  }
}

/*
 * Construct a tree corresponding to current selection on map
 * - if showOnlyOnMap selected, only keep types with nonzero counts, which flattens the tree
 * - add parent types that group multiple types belonging together where necessary
 * - add id, parent_id, title props
 *
 * Special cases:
 * - some types serve as grouping but also correspond to markers annotated to higher level
 * - 'pending review' nodes always have a Pending Review parent
 * - cultivar level types display with cultivar name only, if there is a parent species level type
 */
const constructTypesTreeForSelection = (
  allTypes,
  countsById,
  showOnlyOnMap,
  childrenById,
  scientificNameById,
) => {
  const totalCountsById = {}
  allTypes.forEach((t) => {
    getTotalCount(totalCountsById, t.id, childrenById, countsById)
  })

  const typesForSelection = showOnlyOnMap
    ? allTypes.filter((t) => {
        const { id } = t
        const numChildrenForSelection = (childrenById[id] || []).filter(
          (child_id) => totalCountsById[child_id],
        ).length
        const hasOwnCount = countsById[id]
        const hasTotalCount = totalCountsById[id]

        // If the type is on the map, or more than one of its descendants is on the map, keep it
        return hasOwnCount || (hasTotalCount && numChildrenForSelection > 1)
      })
    : [...allTypes]

  const allIdsForSelection = {}
  typesForSelection.forEach((t) => {
    allIdsForSelection[t.id] = 1
  })

  const idsOfParents = showOnlyOnMap
    ? getChildrenById(typesForSelection)
    : childrenById

  const typesAndParentsForSelection = []

  typesForSelection.forEach((t) => {
    const { id, parent_id } = t
    const isParentInSelection = idsOfParents[id]
    const hasParentInSelection = allIdsForSelection[parent_id]
    const hasOwnCount = countsById[id]
    if (isParentInSelection && hasOwnCount) {
      // Add an extra checkbox
      // (so the user can select just the less specifically annotated
      // types as well as the whole selection)
      typesAndParentsForSelection.push({
        ...t,
        count: countsById[id],
        rcId: `extra-${id}`,
        value: `${id}`,
        rcParentId: `${id}`,
      })
    }
    typesAndParentsForSelection.push({
      ...t,
      count: totalCountsById[id],
      rcId: `${id}`,
      value: `${id}`,
      // The parent is the "Pending Review" if applicable,
      // or parent_id if we decided to display it,
      // or else a special "null" pId that makes it show up at top level
      rcParentId: t.pending
        ? PENDING_ID
        : hasParentInSelection
          ? `${parent_id}`
          : RC_ROOT_ID,
    })
  })
  // Include the special "Pending Review" parent if needed
  if (typesForSelection.some((t) => t.pending)) {
    typesAndParentsForSelection.push({
      id: null,
      parent_id: null,
      value: PENDING_ID,
      rcId: PENDING_ID,
      rcParentId: RC_ROOT_ID,
      name: 'Pending Review',
      count: typesForSelection
        .filter((t) => t.pending)
        .map((t) => countsById[t.id])
        .reduce((a, b) => a + b, 0),
    })
  }
  return sortTypes(typesAndParentsForSelection).map((type) => {
    const { commonName, scientificName } = getNames(type)
    const parentScientificName = scientificNameById[type.parent_id]
    const cultivarIndex = scientificName?.startsWith(
      `${parentScientificName} '`,
    )
      ? scientificName?.indexOf("'")
      : -1
    const isCultivarWithParentInSelection =
      cultivarIndex !== -1 && type.rcParentId !== RC_ROOT_ID
    return {
      ...type,
      searchValue: scientificName
        ? `${commonName} ${scientificName}`
        : `${commonName}`,
      title: (
        <TreeNodeText
          commonName={commonName}
          shouldIncludeScientificName={scientificName}
          shouldIncludeCommonName={
            commonName && !isCultivarWithParentInSelection
          }
          scientificName={
            isCultivarWithParentInSelection
              ? scientificName?.substring(cultivarIndex)
              : scientificName
          }
          count={type.count}
        />
      ),
    }
  })
}

export {
  constructTypesTreeForSelection,
  getChildrenById,
  getScientificNameById,
  RC_ROOT_ID,
}
