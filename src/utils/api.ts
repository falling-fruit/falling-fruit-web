/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios'

import { paths } from './apiSchema'

class APIError extends Error {
  name = 'APIError'
}

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY,
  },
})

const handleResponse = (request: Promise<AxiosResponse<any>>) =>
  request
    .then(
      (res) =>
        // v0.2 API handles client-side parameter errors with
        // a 200 response and an error string in the body
        res.data,
    )
    .catch((error) => {
      const message = error.response?.data.error
      if (message) {
        console.error('APIError:', message, error)
        throw new APIError({ ...error, message })
      } else {
        throw error
      }
    })

export const addUser = (
  params: paths['/users']['post']['requestBody']['content']['application/json'],
) => handleResponse(instance.post('/users', params))

export const editUser = (
  id: paths['/users/{id}']['put']['requestBody']['content']['application/json'],
  params: paths['/users/{id}']['put']['requestBody']['content']['application/json'],
) => handleResponse(instance.put(`/users/${id}`, params))

export const getUserToken = (
  params: paths['/users/token']['get']['parameters']['query'],
) => handleResponse(instance.get('/users/token', { params }))

/* Not used yet
const fileToFormData = (photoData: string | Blob | undefined) => {
  if (photoData !== undefined) {
    const formData = new FormData()
    return formData.append('photo_data', photoData)
  }
  return null
}
*/

export const getClusters = (
  params: paths['/clusters']['get']['parameters']['query'],
) => handleResponse(instance.get('/clusters', { params }))

export const getLocations = (
  params: paths['/locations']['get']['parameters']['query'],
) => handleResponse(instance.get('/locations', { params }))

export const getLocationsCount = (
  params: paths['/locations/count']['get']['parameters']['query'],
) => handleResponse(instance.get('/locations/count', { params }))

export const addLocation = (
  data: paths['/locations']['post']['requestBody']['content']['application/json'],
) => handleResponse(instance.post('/locations', data))

export const getLocationById = (
  id: paths['/locations/{id}']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/locations/${id}`))

export const editLocation = (
  id: paths['/locations/{id}']['put']['parameters']['path']['id'],
  data: paths['/locations/{id}']['put']['requestBody']['content']['application/json'],
) => handleResponse(instance.put(`/locations/${id}`, data))

export const getTypes = () => handleResponse(instance.get('/types'))

export const getTypeCounts = (
  params: paths['/types/counts']['get']['parameters']['query'],
) => handleResponse(instance.get('/types/counts', { params }))

export const getTypeById = (
  id: paths['/types/{id}']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/types/${id}`))

export const getReviews = (
  locationId: paths['/locations/{id}/reviews']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/locations/${locationId}/reviews`))

export const getReviewById = (
  id: paths['/reviews/{id}']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/reviews/${id}`))

export const addReview = (
  locationId: paths['/locations/{id}/reviews']['post']['parameters']['path']['id'],
  data: paths['/locations/{id}/reviews']['post']['requestBody']['content']['multipart/form-data']['json'],
) => {
  const formData = new FormData()
  formData.append('json', JSON.stringify(data))

  return handleResponse(
    instance.post(`/locations/${locationId}/reviews`, formData),
  )
}

export const editReview = (
  id: paths['/reviews/{id}']['put']['parameters']['path']['id'],
  data: paths['/reviews/{id}']['put']['requestBody']['content']['multipart/form-data']['json'],
) => {
  const formData = new FormData()
  formData.append('json', JSON.stringify(data))

  return handleResponse(instance.put(`/reviews/${id}`, formData))
}

/*
export const addReport = (data: paths['/reports']['post']['requestBody']['content']['multipart/form-data']['json']) => {
}
*/

export const getImports = () => handleResponse(instance.get(`/imports`))

export const getImportById = (
  id: paths['/imports/{id}']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/imports/${id}`))

// export const getImportById = Promise.resolve({
//   id: 42,
//   created_at: '2014-06-19T01:02:03.456Z',
//   updated_at: '2014-07-20T12:34:56.789Z',
//   name: 'Les arbres de Grenoble',
//   url: 'http://data.metropolegrenoble.fr/ckan/dataset/les-arbres-de-grenoble',
//   comments: 'Tree inventory of Grenoble, France.',
//   license:
//     'Open Data Commons Open Database License (https://opendefinition.org/licenses/odc-odbl)',
//   muni: true,
//   location_count: 1273,
// })
