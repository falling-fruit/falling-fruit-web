import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/**
 * Returns data about all saved lists relative to a given locationId.
 *
 * @param {string|number} locationId
 * @returns {{
 *   lists: Array<{ listId: number, name: string, checked: boolean }>,
 *   isSavedToAny: boolean,
 * }}
 */
const useSavedLists = (locationId) => {
  const allLists = useSelector((state) => state.save.lists)

  const lists = useMemo(
    () =>
      allLists.map((list) => ({
        listId: list.listId,
        name: list.name,
        checked: list.locationIds.includes(locationId),
      })),
    [allLists, locationId],
  )

  const isSavedToAny = useMemo(() => lists.some((l) => l.checked), [lists])

  return { lists, isSavedToAny }
}

export default useSavedLists
