const buildTypeSchema = (types, showScientificName, countsById) =>
  types.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const name =
      scientificName && showScientificName
        ? `${commonName} [${scientificName}]`
        : commonName
    const count = countsById[type.id] ? countsById[type.id] : 0

    return {
      key: type.id,
      pId: `${type.parent_id}`,
      title: `${name} (${count})`,
      value: `${type.id}`,
    }
  })

export { buildTypeSchema }
