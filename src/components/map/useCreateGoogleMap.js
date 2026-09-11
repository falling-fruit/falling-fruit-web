import { importLibrary } from '@googlemaps/js-api-loader'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { MIN_ZOOM } from '../../constants/map'
import {
  disconnectMap,
  setGeometryReady,
  setGoogle,
  setPlacesReady,
} from '../../redux/mapSlice'

function getTileCoordinates(coord, zoom) {
  const tilesPerGlobe = 1 << zoom
  let x = coord.x % tilesPerGlobe
  if (x < 0) {
    x = tilesPerGlobe + x
  }
  let y = coord.y
  if (coord.y < 0 || coord.y >= tilesPerGlobe) {
    y = null
  }
  return { x, y, z: zoom }
}

const registerOsmTileTypes = (map, maps) => {
  map.mapTypes.set(
    'osm-standard',
    new maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        const { x, y, z } = getTileCoordinates(coord, zoom)
        if (y !== null) {
          return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
        }
      },
      tileSize: new maps.Size(256, 256),
      maxZoom: 19,
    }),
  )
  map.mapTypes.set(
    'osm-toner-lite',
    new maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        const { x, y, z } = getTileCoordinates(coord, zoom)
        if (y !== null) {
          return `https://tiles.stadiamaps.com/tiles/stamen_toner-lite/${z}/${x}/${y}.png`
        }
      },
      tileSize: new maps.Size(256, 256),
      maxZoom: 20,
    }),
  )
}

const useCreateGoogleMap = ({
  initialView,
  googleMap,
  mapContainerRef,
  initListenerRef,
  idleListenerRef,
  overlayLayersRef,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (!initialView || !mapContainerRef.current || googleMap) {
      return undefined
    }

    let cancelled = false

    importLibrary('maps')
      .then(() => {
        if (cancelled || !mapContainerRef.current) {
          return
        }

        const maps = window.google.maps

        const createdMap = new maps.Map(mapContainerRef.current, {
          center: initialView.center,
          zoom: initialView.zoom,
          disableDefaultUI: true,
          minZoom: MIN_ZOOM,
        })

        registerOsmTileTypes(createdMap, maps)

        importLibrary('places')
          .then(() => {
            if (!cancelled) {
              dispatch(setPlacesReady(true))
            }
          })
          .catch((error) => {
            toast.error(
              t('error_message.failed_to_load', {
                error: error.message || t('error_message.unknown_error'),
              }),
            )
          })

        importLibrary('geometry')
          .then(() => {
            if (!cancelled) {
              dispatch(setGeometryReady(true))
            }
          })
          .catch((error) => {
            toast.error(
              t('error_message.failed_to_load', {
                error: error.message || t('error_message.unknown_error'),
              }),
            )
          })

        /*
         * Something breaks when storing maps in redux so pass a reference to it
         */
        initListenerRef.current = maps.event.addListenerOnce(
          createdMap,
          'idle',
          () => {
            initListenerRef.current = null
            if (cancelled) {
              return
            }
            dispatch(
              setGoogle({ googleMap: createdMap, getGoogleMaps: () => maps }),
            )
          },
        )
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load Google Maps', error)
      })

    return () => {
      cancelled = true
      const maps = window.google?.maps
      if (initListenerRef.current && maps) {
        maps.event.removeListener(initListenerRef.current)
        initListenerRef.current = null
      }
      if (idleListenerRef.current && maps) {
        maps.event.removeListener(idleListenerRef.current)
        idleListenerRef.current = null
      }
      overlayLayersRef.current.forEach((layer) => layer.setMap(null))
      overlayLayersRef.current = []
      dispatch(disconnectMap())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialView])
}

export default useCreateGoogleMap
