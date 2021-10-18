const buildTypeSchema = (types, showScientificName) =>
  types.map((type) => {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const name =
      scientificName && showScientificName
        ? `${commonName} [${scientificName}]`
        : commonName

    return {
      key: type.id,
      pId: `${type.parent_id}`,
      title: name,
      value: `${type.id}`,
    }
  })

export { buildTypeSchema }
