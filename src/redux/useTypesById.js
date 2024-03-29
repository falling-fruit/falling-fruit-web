import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export const useTypesById = () => {
  const { i18n } = useTranslation()

  const typesById = useSelector((state) => state.misc.typesById)

  const getCommonNames = useCallback(
    (id) => typesById[id]?.common_names[i18n.language],
    [typesById, i18n.language],
  )

  const getCommonName = (id) => getCommonNames(id)?.[0]

  const getLocationTypes = (location) =>
    location.type_ids.map(getCommonName).join(', ')

  const getScientificName = (id) => typesById[id]?.scientific_names[0]

  return {
    typesById,
    getCommonNames,
    getCommonName,
    getScientificName,
    getLocationTypes,
  }
}
