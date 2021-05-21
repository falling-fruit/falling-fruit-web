/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios'

import { paths } from './apiSchema'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  params: {
    api_key: process.env.REACT_APP_API_KEY,
  },
})

const handleResponse = (request: Promise<AxiosResponse<any>>) =>
  request.then((res) => {
    // v0.2 API handles client-side parameter errors with
    // a 200 response and an error string in the body
    if (res.data.error) {
      throw new Error(res.data.error)
    }
    return res.data
  })

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
) =>
  handleResponse(
    instance.get('/clusters', {
      params,
    }),
  )

export const getLocations = (
  params: paths['/locations']['get']['parameters']['query'],
) =>
  handleResponse(
    instance.get('/locations', {
      params,
    }),
  )

/* Not implemented
export const addLocation = (
  params: paths['/locations']['post']['parameters']['query'],
  photoData?: File,
) =>
  handleResponse(
    instance.post('/locations', fileToFormData(photoData), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params,
    }),
  )
*/

export const getLocationById = (
  id: paths['/locations/{id}']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/locations/${id}`))

/* Not implemented
export const updateLocation = (
  id: paths['/locations/{id}']['post']['parameters']['path']['id'],
  params: paths['/locations/{id}']['post']['parameters']['query'],
) =>
  handleResponse(
    instance.post(`/locations/${id}`, null, {
      params,
    }),
  )
*/

export const getTypes = () => handleResponse(instance.get('/types'))

export const getTypeCounts = (
  params: paths['/types/counts']['get']['parameters']['query'],
) =>
  handleResponse(
    instance.get('/types/counts', {
      params,
    }),
  )

export const getTypeById = (
  id: paths['/types/{id}']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/types/${id}`))

export const getReviews = (
  locationId: paths['/locations/{id}/reviews']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/locations/${locationId}/reviews`))

/* Not implemented
export const addReview = (
  locationId: paths['/locations/{id}/review']['post']['parameters']['path']['id'],
  params: paths['/locations/{id}/review']['post']['parameters']['query'],
  photoData?: File,
) =>
  handleResponse(
    instance.post(
      `/locations/${locationId}/review`,
      fileToFormData(photoData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params,
      },
    ),
  )
*/
