import { Capacitor } from '@capacitor/core'
import { useSelector } from 'react-redux'

const useShareUrl = () => {
  const { mapType, showLabels, overlay, showBusinesses } = useSelector(
    (state) => state.settings,
  )
  const { muni, types } = useSelector((state) => state.filter)
  const typeEncoder = useSelector((state) => state.type.typeEncoder)

  const baseUrl = Capacitor.isNativePlatform()
    ? 'https://fallingfruit.org'
    : window.location.origin
  const url = new URL(
    baseUrl + window.location.pathname + window.location.search,
  )
  if (url.pathname.startsWith('/filters')) {
    url.pathname = url.pathname.replace(/^\/filters/, '/map')
  }
  url.searchParams.delete('embed')
  if (mapType !== 'roadmap') {
    url.searchParams.set('map', mapType)
  }
  if (showLabels) {
    url.searchParams.set('labels', 'true')
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
