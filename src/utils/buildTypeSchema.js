const buildTypeSchema = (types, showScientificName, countsById) => {
  const typesWithRootLabels = types.map((t) => {
    if (!t.parent_id) {
      return {
        ...t,
        value: `root-${t.id}`,
        pId: 'null',
      }
    }
    return {
      ...t,
      value: `${t.id}`,
      pId: `root-${t.parent_id}`,
    }
  })

  const typesWithOtherCategory = [...typesWithRootLabels]
  typesWithRootLabels.forEach((t) => {
    if (!t.parent_id) {
      typesWithOtherCategory.push({
        ...t,
        value: `${t.id}`,
        pId: `root-${t.id}`,
      })
    }
  })

  return typesWithOtherCategory.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const name =
      scientificName && showScientificName
        ? `${commonName} [${scientificName}]`
        : commonName
    const count = countsById[type.id] ? countsById[type.id] : 0

    return {
      pId: type.pId,
      title: `${name} (${count})`,
      value: type.value,
    }
  })
}

export { buildTypeSchema }
