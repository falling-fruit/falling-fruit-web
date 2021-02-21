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

const fileToFormData = (photoData: string | Blob | undefined) => {
  if (photoData !== undefined) {
    var formData = new FormData();
    return formData.append("photo_data", photoData)
  } 
  return null;
};

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


export const addLocation = (
  params: paths['/locations.json']['post']['parameters']['query'],
  photoData?: File,
) => handleResponse(
    instance.post('/locations.json', fileToFormData(photoData), {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params,
    }),
  )
  
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
  
export const addReview = (
  params: paths['/locations/{id}/review.json']['post']['parameters']['query'],
  id: paths['/locations/{id}/review.json']['post']['parameters']['path']['id'],
  photoData?: File
) => {
  return handleResponse(
    instance.post(`/locations/${id}/review.json`, fileToFormData(photoData), {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params,
    }),
  )
}
