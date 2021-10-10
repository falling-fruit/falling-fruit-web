const buildTypeSchema = (types, showScientificName) => {
  const typeSchema = []
  for (const type of types) {
    const commonName = type.name ?? type.common_names.en[0]
    const scientificName = type.scientific_names?.[0]
    const name =
      scientificName && showScientificName
        ? `${commonName} [${scientificName}]`
        : commonName

    typeSchema.push({
      key: type.id,
      pId: `${type.parent_id}`,
      title: name,
      value: `${type.id}`,
    })
  }
  return typeSchema
}

export { buildTypeSchema }
