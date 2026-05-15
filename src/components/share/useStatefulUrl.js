import { Capacitor } from '@capacitor/core'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { LabelVisibility, MapType } from '../../constants/settings'
import {
  applyLegacyViewParams,
  currentPathWithoutViewSegment,
  viewFromCurrentUrl,
} from '../../utils/appUrl'

const useStatefulUrl = ({ baseUrl, useLegacyViewParams }) => {
  const { mapType, labelVisibility, overlay, showBusinesses } = useSelector(
    (state) => state.settings,
  )
  const { muni, types } = useSelector((state) => state.filter)
  const typeEncoder = useSelector((state) => state.type.typeEncoder)

  const encodedTypes = useMemo(
    () => typeEncoder.encode(types),
    [typeEncoder, types],
  )

  const pathname = useLegacyViewParams
    ? currentPathWithoutViewSegment()
    : window.location.pathname

  const url = new URL(baseUrl + pathname + window.location.search)

  if (url.pathname.startsWith('/filters')) {
    url.pathname = url.pathname.replace(/^\/filters/, '/map')
  }

  url.searchParams.delete('embed')

  if (useLegacyViewParams) {
    applyLegacyViewParams(url.searchParams, viewFromCurrentUrl())
  }

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

  if (encodedTypes !== 'default') {
    url.searchParams.set('types', encodedTypes)
  }

  return url.toString()
}

const useShareUrl = () => {
  const baseUrl = Capacitor.isNativePlatform()
    ? 'https://fallingfruit.org'
    : window.location.origin

  return useStatefulUrl({ baseUrl, useLegacyViewParams: false })
}

const useRestartUrl = () => {
  const fullUrl = useStatefulUrl({
    baseUrl: window.location.origin,
    useLegacyViewParams: true, //avoid misparsing dot in Capacitor
  })
  return fullUrl.replace(window.location.origin, '')
}

export { useRestartUrl, useShareUrl }
