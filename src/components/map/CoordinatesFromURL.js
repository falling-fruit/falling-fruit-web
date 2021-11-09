import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import { viewChangeAndFetch } from '../../redux/viewChange'

export const CoordinatesFromURL = () => {
  console.log('HERE')

  const dispatch = useDispatch()

  const geocoordmatch = useRouteMatch({
    path: '/map/:geocoord',
    exact: true,
  })

  useEffect(() => {
    console.log('effect')
    const floatRegex = /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/

    const isValidCoord = () => {
      if (!geocoordmatch?.params.geocoord) {
        return false
      }
      const param = geocoordmatch.params.geocoord
      //@lat,long,zoomz

      const values = param.substring(1, param.length - 1).split(',')
      return {
        valid:
          (param.match(/\,/g) || []).length === 2 &&
          param.charAt(0) === '@' &&
          param.charAt(param.length - 1) === 'z' &&
          floatRegex.test(values[0]) &&
          floatRegex.test(values[1]) &&
          floatRegex.test(values[2]) &&
          parseFloat(values[0]) >= -90 &&
          parseFloat(values[0]) <= 90 &&
          parseFloat(values[1]) >= -180 &&
          parseFloat(values[1]) <= 180 &&
          parseFloat(values[2]) > 1 &&
          parseFloat(values[2]) <= 21,
        lat: parseFloat(values[0]),
        lng: parseFloat(values[1]),
        zoom: parseFloat(values[2]),
      }
    }
    const getCoords = isValidCoord()
    const initialView = getCoords.valid
      ? {
          lat: getCoords.lat,
          lng: getCoords.lng,
          zoom: getCoords.zoom,
        }
      : { lat: 40.1125785, lng: -88.2287926, zoom: 1 }
    console.log(initialView)
    dispatch(viewChangeAndFetch(initialView, true))
    // setTimeout(() => dispatch(viewChangeAndFetch(initialView, true)), 1000)
  }, [])
  return null
}
