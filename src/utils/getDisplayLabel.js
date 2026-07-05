/**
 * Resolve the display label for a location type id.
 *
 * Returns an object describing the best human-readable name for the type
 * (common name, cultivar, or scientific name), or null when nothing suitable
 * is available. Shared by the map markers and the Street View panorama marker.
 *
 * @param {object} typesAccess - the typesAccess helper from the type slice
 * @param {number} id - the type id to label
 * @returns {{text: string, isScientific: boolean, typeId: number}|null}
 */
export const getDisplayLabel = (typesAccess, id) => {
  const type = typesAccess.getType(id)
  if (!type) {
    return null
  }

  if (type.cultivar) {
    const parentType = typesAccess.getParentType(id)
    if (
      parentType &&
      parentType.commonName &&
      parentType.scientificName &&
      (!type.commonName ||
        type.commonName.toLowerCase() === parentType.commonName.toLowerCase())
    ) {
      return {
        text: `${parentType.commonName} '${type.cultivar}'`,
        isScientific: false,
        typeId: id,
      }
    }
  }

  if (type.commonName) {
    return {
      text: type.commonName,
      isScientific: false,
      typeId: id,
    }
  }

  if (type.scientificName) {
    return {
      text: type.scientificName,
      isScientific: true,
      typeId: id,
    }
  }

  return null
}
