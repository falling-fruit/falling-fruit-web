import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useSavedLists = (locationId) => {
  const allLists = useSelector((state) => state.save.lists)

  const lists = useMemo(
    () =>
      allLists.map((list) => ({
        listId: list.id,
        name: list.name,
        checked: (list.locations || []).some((list) => list.id === locationId),
      })),
    [allLists, locationId],
  )

  return { lists }
}

export default useSavedLists
