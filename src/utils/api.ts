/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios'

import { paths } from './api-schema'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  params: {
    api_key: process.env.REACT_APP_API_KEY,
  },
})

const handleResponse = (request: Promise<AxiosResponse<any>>) =>
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

// Since all of the locale values are in the TypeScript schema now, we don't
// need this "enum" anymore. Please delete it!
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
Object.freeze(LOCALE)

// Follow this example!
export const getClusters = (
  params: paths['/clusters.json']['get']['parameters']['query'],
) =>
  handleResponse(
    instance.get('/clusters.json', {
      params,
    }),
  )

export const getLocations = (
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
        muni: includeMunicipal ? 1 : 0,
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

export const postLocations = (
  { lng, lat },
  type_ids,
  author = null,
  description = null,
  season_start = 0,
  season_stop = 0,
  no_season = false,
  unverified = false,
  access = 0,
  comment = null,
  fruiting = 0,
  quality_rating = 0,
  yield_rating = 0,
  observed_on = null,
  photo_file_name = null,
  // See below for how to handle photo_data.
  { photo_data } = null,
) =>
  handleResponse(
    instance.post('/locations.json', photo_data, {
      params: {
        lng,
        lat,
        type_ids,
        author,
        description,
        season_start,
        season_stop,
        no_season,
        unverified,
        access,
        comment,
        fruiting,
        quality_rating,
        yield_rating,
        observed_on,
        photo_file_name,
      },
    }),
  )

// Follow this example!
export const getLocationById = (
  id: paths['/locations/{id}.json']['get']['parameters']['path']['id'],
  params: paths['/locations/{id}.json']['get']['parameters']['query'],
) =>
  handleResponse(
    instance.get(`/locations/${id}.json`, {
      params,
    }),
  )

export const editLocation = (
  id,
  { lng, lat },
  type_ids,
  author = null,
  description = null,
  season_start = 0,
  season_stop = 0,
  no_season = false,
  unverified = false,
  access = 0,
) =>
  handleResponse(
    instance.post(`/locations/${id}.json`, null, {
      params: {
        lng,
        lat,
        type_ids,
        author,
        description,
        season_start,
        season_stop,
        no_season,
        unverified,
        access,
      },
    }),
  )

export const getTypes = (
  params: paths['/types.json']['get']['parameters']['query'],
) =>
  handleResponse(
    instance.get('/types.json', {
      params,
    }),
  )

export const getTypesById = (
  id: paths['/types/{id}.json']['get']['parameters']['path']['id'],
) =>
  handleResponse(
    instance.get(`/types/${id}.json`)
  )

export const getReviews = (
  locationId: paths['/locations/{id}/reviews.json']['get']['parameters']['path']['id'],
) =>
  handleResponse(
    instance.get(`/locations/${locationId}/reviews.json`)
  )
  
  var imagefile = document.querySelector('#file');
export const postReview = (
  params: paths['/locations/{id}/review.json']['post']['parameters']['query'],
  id: paths['/locations/{id}/review.json']['post']['parameters']['path']['id'],
  photo_data?: File
) => {
  var formData = new FormData();

  formData.append("photo_data", photo_data);
  
  return handleResponse(
    instance.post(`/locations/${id}/review.json`, formData != null ? formData : null, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params,
    }),
  )
}