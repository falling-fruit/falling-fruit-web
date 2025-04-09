class TypeShareEncoder {
  constructor(typesAccess) {
    this.typesAccess = typesAccess
    this.allTypeIds = typesAccess.selectableTypes().map((type) => type.id)
    this.familiesByHeadId = this.buildFamiliesByHeadId()
  }

  /**
   * Builds a map of head type IDs to their complete family (descendants)
   * Includes all types that have children, not just root types
   * @returns {Object} Map of head ID to array of descendant IDs
   */
  buildFamiliesByHeadId() {
    const familiesByHeadId = {}

    // Get all types that have children
    const typesWithChildren = new Set(
      Object.keys(this.typesAccess.childrenById).map(Number),
    )

    // Build families for all types with children
    for (const typeId of typesWithChildren) {
      const familyIds = this.getCompleteFamily(typeId)
      familiesByHeadId[typeId] = familyIds
    }

    return familiesByHeadId
  }

  /**
   * Gets all descendants of a type (complete family)
   * @param {number} typeId - The head type ID
   * @returns {number[]} Array of all descendant IDs including the head ID
   */
  getCompleteFamily(typeId) {
    const result = [typeId]
    const childrenIds = this.typesAccess.childrenById[typeId] || []

    for (const childId of childrenIds) {
      result.push(...this.getCompleteFamily(childId))
    }

    return result
  }

  /**
   * Encodes type IDs for URL sharing
   * @param {number[]} typeIds - Array of type IDs
   * @returns {string} Encoded string in format: [default/all/nothing].(id).h(head id)-(id)
   * e.g. default.123h5.20.25-456
   */
  encode(typeIds) {
    if (!typeIds || typeIds.length === 0) {
      return ''
    }

    // Check if all types are selected
    if (this.isAllTypesSelected(typeIds)) {
      return 'all'
    }

    // Check if default selection
    if (this.isDefaultSelection(typeIds)) {
      return 'default'
    }

    // Generate all possible representations and choose the shortest
    const representations = []

    // 1. Direct list of IDs
    const directList = this.optimizeWithFamilies(typeIds)
    representations.push(directList)

    // 2. All minus unselected
    const unselectedTypeIds = this.getUnselectedTypeIds(typeIds)
    if (unselectedTypeIds.length > 0) {
      const optimizedUnselected = this.optimizeWithFamilies(unselectedTypeIds)
      representations.push(`all-${optimizedUnselected}`)
    }

    // 3. Default plus/minus
    const defaultTypeIds = this.getDefaultTypeIds()
    const additionalTypeIds = typeIds.filter(
      (id) => !defaultTypeIds.includes(id),
    )
    const removedDefaultTypeIds = defaultTypeIds.filter(
      (id) => !typeIds.includes(id),
    )

    if (additionalTypeIds.length > 0 || removedDefaultTypeIds.length > 0) {
      let defaultPlusMinus = 'default'

      if (additionalTypeIds.length > 0) {
        const optimizedAdditional = this.optimizeWithFamilies(additionalTypeIds)
        defaultPlusMinus += `.${optimizedAdditional}`
      }

      if (removedDefaultTypeIds.length > 0) {
        const optimizedRemoved = this.optimizeWithFamilies(
          removedDefaultTypeIds,
        )
        defaultPlusMinus += `-${optimizedRemoved}`
      }

      representations.push(defaultPlusMinus)
    }

    // Find the shortest representation
    let shortestRepresentation = representations[0]
    let shortestLength = shortestRepresentation.length

    for (let i = 1; i < representations.length; i++) {
      const currentLength = representations[i].length
      if (currentLength < shortestLength) {
        shortestRepresentation = representations[i]
        shortestLength = currentLength
      }
    }

    return shortestRepresentation
  }

  /**
   * Decodes type string from URL to array of type IDs
   * @param {string} encodedTypes - Encoded string in format: [default/all/nothing].(id).h(head id)-(id)
   * e.g. default.123h5.20.25-456
   * @returns {number[]} Array of type IDs
   */
  decode(encodedTypes) {
    if (!encodedTypes) {
      return []
    }

    let state = 'add'
    let currentToken = ''
    let result
    let i
    let isHeadId = false

    if (encodedTypes.startsWith('all')) {
      result = [...this.allTypeIds]
      i = 3
    } else if (encodedTypes.startsWith('default')) {
      result = [...this.getDefaultTypeIds()]
      i = 7
    } else {
      result = []
      i = 0
    }

    const processToken = () => {
      if (currentToken) {
        if (isHeadId) {
          // Process a family head ID
          const headId = parseInt(currentToken, 10)
          const familyIds = this.familiesByHeadId[headId] || []

          if (state === 'add') {
            // Add all family members
            for (const id of familyIds) {
              if (!result.includes(id)) {
                result.push(id)
              }
            }
          } else if (state === 'remove') {
            // Remove all family members
            result = result.filter((typeId) => !familyIds.includes(typeId))
          }
          isHeadId = false
        } else {
          // Process a regular ID
          const id = parseInt(currentToken, 10)
          if (state === 'add') {
            if (!result.includes(id)) {
              result.push(id)
            }
          } else if (state === 'remove') {
            result = result.filter((typeId) => typeId !== id)
          }
        }
        currentToken = ''
      }
    }

    while (i < encodedTypes.length) {
      const char = encodedTypes[i]
      if (char === '.') {
        processToken()
      } else if (char === '-') {
        processToken()
        state = 'remove'
      } else if (char === 'h') {
        processToken()
        isHeadId = true
      } else {
        currentToken += char
      }
      i++
    }
    processToken()

    return result
  }

  /**
   * Checks if the provided type IDs represent all available types
   * @param {number[]} typeIds - Array of type IDs to check
   * @returns {boolean} True if all types are selected
   */
  isAllTypesSelected(typeIds) {
    const missingTypeIds = this.allTypeIds.filter((id) => !typeIds.includes(id))
    return missingTypeIds.length === 0
  }

  /**
   * Checks if the provided type IDs represent the default selection
   * @param {number[]} typeIds - Array of type IDs to check
   * @returns {boolean} True if default selection
   */
  isDefaultSelection(typeIds) {
    const defaultTypeIds = this.getDefaultTypeIds()

    // Check if arrays have the same length
    if (typeIds.length !== defaultTypeIds.length) {
      return false
    }

    // Check if all default types are included
    return defaultTypeIds.every((id) => typeIds.includes(id))
  }

  /**
   * Returns the default type IDs
   * @returns {number[]} Array of default type IDs
   */
  getDefaultTypeIds() {
    // Duplicate logic from fetchAndLocalizeTypes.fulfilled in filterSlice.js
    return this.typesAccess
      .selectableTypesWithCategories('forager', 'freegan')
      .map((t) => t.id)
  }

  /**
   * Returns type IDs that are not selected
   * @param {number[]} selectedTypeIds - Array of selected type IDs
   * @returns {number[]} Array of unselected type IDs
   */
  getUnselectedTypeIds(selectedTypeIds) {
    return this.allTypeIds.filter((id) => !selectedTypeIds.includes(id))
  }

  /**
   * Checks if the provided type IDs represent default selection plus additional types
   * and/or minus some default types
   * @param {number[]} typeIds - Array of type IDs to check
   * @returns {boolean} True if default plus/minus format is appropriate
   * @deprecated This method is no longer used as we now compare actual string lengths
   */
  isDefaultPlusMinusFormat(typeIds) {
    const defaultTypeIds = this.getDefaultTypeIds()
    const additionalTypeIds = typeIds.filter(
      (id) => !defaultTypeIds.includes(id),
    )
    const removedDefaultTypeIds = defaultTypeIds.filter(
      (id) => !typeIds.includes(id),
    )

    // Use this format if there are additional types or some default types are removed
    // but not if too many changes (in which case direct listing might be more efficient)
    return (
      (additionalTypeIds.length > 0 || removedDefaultTypeIds.length > 0) &&
      additionalTypeIds.length + removedDefaultTypeIds.length <= 20
    )
  }

  /**
   * Optimizes a list of type IDs by replacing complete families with their head IDs
   * @param {number[]} typeIds - Array of type IDs to optimize
   * @returns {string} Optimized string representation with families represented by head IDs
   */
  optimizeWithFamilies(typeIds) {
    // Make a copy of the type IDs to work with
    let remainingTypeIds = [...typeIds]
    const parts = []

    // Sort families by size (largest first) to prioritize larger families
    const sortedFamilyEntries = Object.entries(this.familiesByHeadId)
      .map(([headId, familyIds]) => ({
        headId: Number(headId),
        familyIds,
        size: familyIds.length,
      }))
      .sort((a, b) => b.size - a.size)

    // Track which families we've already included
    const includedFamilyHeadIds = new Set()

    // Find complete families in the selection
    for (const { headId, familyIds } of sortedFamilyEntries) {
      // Skip if this family's head is already part of an included family
      if (includedFamilyHeadIds.has(headId)) {
        continue
      }

      // Check if all family members are in the selection
      if (familyIds.every((id) => typeIds.includes(id))) {
        // Check if any family member is already removed from remainingTypeIds
        // (which would mean it's part of a larger family we've already included)
        const allMembersRemaining = familyIds.every((id) =>
          remainingTypeIds.includes(id),
        )

        if (allMembersRemaining) {
          // Remove family members from remaining IDs
          remainingTypeIds = remainingTypeIds.filter(
            (id) => !familyIds.includes(id),
          )

          // Add the family head notation
          parts.push(`h${headId}`)

          // Mark all family members as included
          familyIds.forEach((id) => includedFamilyHeadIds.add(id))
        }
      }
    }

    // Add remaining individual type IDs
    for (const id of remainingTypeIds) {
      parts.push(id.toString())
    }

    return parts.join('.')
  }
}

export default TypeShareEncoder
