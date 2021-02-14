/* eslint-disable no-console */

import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  params: {
    api_key: process.env.REACT_APP_API_KEY,
  },
})

const handleResponse = (request) =>
  request.then(
    (res) => {
      // v0.2 API handles client-side parameter errors with
      // a 200 response and an error string in the body
      if (res.data.error) {
        console.error(res.data.error)
        return null
      }
      return res.data
    },
    (err) => {
      console.error(err)
      return null
    },
  )

export const getClusters = (
  { swlng, nelng, swlat, nelat },
  zoom = 0,
  muni = false,
  types = null,
) =>
  handleResponse(
    instance.get('/clusters.json', {
      params: {
        swlng,
        nelng,
        swlat,
        nelat,
        zoom,
        muni: muni ? 1 : 0,
        t: types,
      },
    }),
  )

export const LOCALE = {
  EN: 'en',
  DE: 'de',
  EL: 'el',
  ES: 'es',
  FR: 'fr',
  HE: 'he',
  IT: 'it',
  NL: 'nl',
  PL: 'pl',
}

export const getLocation = (
  { swlng, nelng, swlat, nelat },
  includeMunicipal = false,
  categories = null,
  types = null,
  locale = LOCALE.EN,
  invasive = false,
  limit = 1000,
  offset = 0,
  reviews = false,
  { lng = 0, lat = 0 },
) =>
  handleResponse(
    instance.get('/locations.json', {
      params: {
        swlng,
        nelng,
        swlat,
        nelat,
        municipal: includeMunicipal ? 1 : 0,
        c: categories,
        t: types,
        invasive: invasive ? 1 : 0,
        limit,
        offset,
        locale,
        reviews: reviews ? 1 : 0,
        lng,
        lat,
      },
    }),
  )

// export const postLocation = (
//   {lng, lat},
//   type_ids = null,
//   includeMunicipal = false,
//   c = null,
//   t = null,
//   locale,
//   invasive = false,
//   limit = 1000,
//   offset = 0,
//   reviews = false,
//   lng = 0,
//   lat = 0
// ) =>
//   handleResponse(
//     instance.post('/locations.json', photo_data, {
//       params: {
//         swlng,
//         nelng,
//         swlat,
//         nelat,
//         municipal: includeMunicipal ? 1 : 0,
//         c: categories,
//         t: types,
//         invasive: invasive ? 1 : 0,
//         limit,
//         offset,
//         locale,
//         reviews: reviews ? 1 : 0,
//         lng,
//         lat
//       },
//     }),
//   )

export const getTypes = () => handleResponse(instance.get('/types.json', {}))
