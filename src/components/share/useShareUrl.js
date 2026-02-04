import { Capacitor } from '@capacitor/core'
import { useSelector } from 'react-redux'

import { LabelVisibility, MapType } from '../../constants/settings'

const useShareUrl = () => {
  const { mapType, labelVisibility, overlay, showBusinesses } = useSelector(
    (state) => state.settings,
  )
  const { muni, types } = useSelector((state) => state.filter)
  const typeEncoder = useSelector((state) => state.type.typeEncoder)

  const baseUrl = Capacitor.isNativePlatform()
    ? 'https://beta.fallingfruit.org'
    : window.location.origin
  const url = new URL(
    baseUrl + window.location.pathname + window.location.search,
  )
  if (url.pathname.startsWith('/filters')) {
    url.pathname = url.pathname.replace(/^\/filters/, '/map')
  }
  url.searchParams.delete('embed')
  if (mapType !== MapType.Roadmap) {
    url.searchParams.set('map', mapType)
  }
  const labelParam = LabelVisibility.toUrlParam(labelVisibility)
  if (labelParam !== null) {
    url.searchParams.set('labels', labelParam)
  }
  if (overlay) {
    url.searchParams.set('overlay', overlay)
  }
  if (!muni) {
    url.searchParams.set('muni', 'false')
  }
  if (showBusinesses) {
    url.searchParams.set('poi', 'true')
  }
  const encodedTypes = typeEncoder.encode(types)
  if (encodedTypes !== 'default') {
    url.searchParams.set('types', encodedTypes)
  }
  return url.toString()
}

export default useShareUrl
