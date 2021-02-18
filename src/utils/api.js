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

export const getClusters = (
  { swlng, nelng, swlat, nelat },
  zoom = 0,
  includeMunicipal = false,
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
        muni: includeMunicipal ? 1 : 0,
        t: types,
      },
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

export const getLocationById = (id, locale = LOCALE.en) =>
  handleResponse(
    instance.get(`/locations/${id}.json`, {
      params: {
        locale,
      },
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
  { swlng, nelng, swlat, nelat } = 0,
  zoom = 0,
  muni = false,
  locale = LOCALE.EN,
  types = null,
  urls = false,
  categories = null,
  uncategorized = false,
  pending = false,
) =>
  handleResponse(
    instance.get('/types.json', {
      params: {
        swlng,
        nelng,
        swlat,
        nelat,
        zoom,
        muni: muni ? 1 : 0,
        locale,
        t: types,
        urls: urls ? 1 : 0,
        categories,
        uncategorized: uncategorized ? 1 : 0,
        pending: pending ? 0 : 1,
      },
    }),
  )

export const getTypesById = (id) =>
  handleResponse(instance.get(`/types/${id}.json`))

export const getReviews = (id) =>
  handleResponse(
    instance.get(`/locations/${id}/reviews.json`, {
      params: {},
    }),
  )

export const postReview = (
  id,
  author = null,
  comment = null,
  fruiting = null,
  quality_rating = null,
  yield_rating = null,
  observed_on = null,
  photo_file_name = null,
  { photo_data },
) =>
  handleResponse(
    instance.post(`/locations/${id}/review.json`, photo_data, {
      params: {
        author,
        comment,
        fruiting,
        quality_rating,
        yield_rating,
        observed_on,
        photo_file_name,
      },
    }),
  )
