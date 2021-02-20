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
  params: paths['/locations.json']['get']['parameters']['query'],
) =>
  handleResponse(
    instance.get('/locations.json', {
      params,
    }),
  )  


export const postLocations = (
  params: paths['/locations.json']['post']['parameters']['query'],
  photo_data?: File['/locations.json']['post']['parameters']['query'] ,
) => {
  var formData = new FormData();
  formData.append("photo_data", photo_data)
  return handleResponse(
    instance.post('/locations.json', photo_data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params,
    }),
  )
}
  
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
  id: paths['/locations/{id}.json']['post']['parameters']['path']['id'],
  params: paths['/locations/{id}.json']['post']['parameters']['query'],
) =>
  handleResponse(
    instance.post(`/locations/${id}.json`, null, {
      params,
    }),
  )

export const getTypes = (
  { swlng, nelng, swlat, nelat },
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
        pending: pending ? 1 : 0,
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
  // You will want to take photo_data in the same way you take id, with a few differences:
  // 1. Type it as photo_data?: File (the ? makes it optional)
  // 2. Send it as multi-part form data. See here: https://stackoverflow.com/a/43014086/2411756
  //    (for formData.append, use "photo_data" for the 1st argument, and the actual argument photo_data for the 2nd argument)
  // 3. Make sure you pass the correct headers in Axios!
  // 4. Pass formData directly as the 2nd argument of instance.post. However, if (!photo_data), pass null instead!
  // If you're having trouble, please read through these links:
  // - https://developer.mozilla.org/en-US/docs/Web/API/FormData
  // - https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
  // You will need to give this function an actual body, i.e. add braces after => and return handleResponse after
  // you finish building the formData object.
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
