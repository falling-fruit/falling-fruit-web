import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { LabelVisibility, MapType } from '../../constants/settings'
import { setLanguageFromLocaleString } from '../../i18n'
import { updateSettings } from '../../redux/settingsSlice'
import { updateSelection } from '../../redux/updateSelection'
import { useAppHistory } from '../../utils/useAppHistory'

const ConnectShare = () => {
  const location = useLocation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { typesAccess, typeEncoder } = useSelector((state) => state.type)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)

    const mapType = searchParams.get('map')
    const labelVisibilityParam = searchParams.get('labels')
    const overlay = searchParams.get('overlay')
    const showBusinesses = searchParams.get('poi')
    const locale = searchParams.get('locale')

    const legacyMapType = searchParams.get('t')
    const legacyLabels = searchParams.get('l')

    const settingsUpdates = {}

    if (mapType !== null) {
      if (MapType.isValid(mapType)) {
        settingsUpdates.mapType = mapType
      }
      history.removeParam('map')
    }

    if (labelVisibilityParam !== null) {
      const labelVisibility = LabelVisibility.fromUrlParam(labelVisibilityParam)
      if (labelVisibility !== null) {
        settingsUpdates.labelVisibility = labelVisibility
      }
      history.removeParam('labels')
    }

    if (showBusinesses !== null) {
      if (showBusinesses === 'true') {
        settingsUpdates.showBusinesses = true
      }
      history.removeParam('poi')
    }

    if (overlay !== null) {
      settingsUpdates.overlay = overlay
      history.removeParam('overlay')
    }

    if (legacyMapType !== null) {
      const mappedType = MapType.fromLegacyParam(legacyMapType)
      if (mappedType !== null) {
        settingsUpdates.mapType = mappedType
      }
      history.removeParam('t')
    }

    if (legacyLabels !== null) {
      const labelVisibility = LabelVisibility.fromUrlParam(legacyLabels)
      if (labelVisibility !== null) {
        settingsUpdates.labelVisibility = labelVisibility
      }
      history.removeParam('l')
    }

    if (locale !== null) {
      setLanguageFromLocaleString(locale)
      history.removeParam('locale')
    }

    if (Object.keys(settingsUpdates).length > 0) {
      dispatch(updateSettings(settingsUpdates))
    }
  }, [location.search, dispatch, history])

  useEffect(() => {
    if (typesAccess.isEmpty) {
      return
    }

    const searchParams = new URLSearchParams(location.search)

    const muni = searchParams.get('muni')
    const legacyMuni = searchParams.get('m')
    const encodedTypes = searchParams.get('types')
    const legacyTypes = searchParams.get('f')
    const legacyCategories = searchParams.get('c')

    const filterUpdates = {}

    if (muni !== null) {
      if (muni === 'false') {
        filterUpdates.muni = false
      }
      history.removeParam('muni')
    }
    if (legacyMuni !== null) {
      if (legacyMuni === 'false') {
        filterUpdates.muni = false
      }
      history.removeParam('m')
    }

    if (encodedTypes !== null) {
      filterUpdates.types = typeEncoder.decode(encodedTypes)
      history.removeParam('types')
    }

    if (legacyTypes !== null) {
      const dotSeparatedTypes = legacyTypes.replace(/,/g, '.')
      filterUpdates.types = typeEncoder.decode(dotSeparatedTypes)
      history.removeParam('f')
    }

    if (legacyCategories !== null) {
      const categories = legacyCategories.split(',')
      const typeIds = typesAccess
        .selectableTypesWithCategories(...categories)
        .map((t) => t.id)
      filterUpdates.types = typeIds
      history.removeParam('c')
    }

    if (Object.keys(filterUpdates).length > 0) {
      dispatch(updateSelection(filterUpdates))
    }
  }, [location.search, dispatch, history, typesAccess, typeEncoder])

  return null
}

export default ConnectShare
