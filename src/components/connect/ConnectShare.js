import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

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
    const showLabels = searchParams.get('labels')
    const overlay = searchParams.get('overlay')
    const showBusinesses = searchParams.get('poi')

    const legacyMapType = searchParams.get('t')
    const legacyLabels = searchParams.get('l')

    const settingsUpdates = {}

    if (mapType !== null) {
      settingsUpdates.mapType = mapType
      history.removeParam('map')
    }

    if (showLabels !== null) {
      if (showLabels === 'true') {
        settingsUpdates.showLabels = true
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
      if (legacyMapType === 'toner-lite') {
        settingsUpdates.mapType = 'osm-toner-lite'
      } else if (legacyMapType === 'osm') {
        settingsUpdates.mapType = 'osm-standard'
      } else {
        settingsUpdates.mapType = legacyMapType
      }
      history.removeParam('t')
    }

    if (legacyLabels !== null) {
      if (legacyLabels === 'true') {
        settingsUpdates.showLabels = true
      }
      history.removeParam('l')
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
