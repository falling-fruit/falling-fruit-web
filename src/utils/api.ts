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

const fileToFormData = (photoData: string | Blob | undefined) => {
  if (photoData !== undefined) {
    const formData = new FormData()
    return formData.append('photo_data', photoData)
  }
  return null
}

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
) =>
  handleResponse(
    instance.post('/locations.json', fileToFormData(photoData), {
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const updateLocation = (
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

export const getTypesMock = () => [
  {
    id: 377,
    scientific_name: 'Acacia',
    name: 'Wattle',
    parent_id: null,
    count: 227,
  },
  {
    id: 327,
    scientific_name: 'Acacia aneura',
    name: 'Mulga acacia',
    parent_id: 377,
    count: 1807,
  },
  {
    id: 1236,
    scientific_name: 'Acacia coriacea',
    name: 'Wiry wattle',
    parent_id: 377,
    count: 5,
  },
  {
    id: 979,
    scientific_name: 'Acacia cultriformis',
    name: 'Knife-leaf wattle',
    parent_id: 377,
    count: 4,
  },
  {
    id: 175,
    scientific_name: 'Acer',
    name: 'Maple',
    parent_id: null,
    count: 2991,
  },
  {
    id: 1347,
    scientific_name: 'Acer circinatum',
    name: 'Vine maple',
    parent_id: 175,
    count: 91,
  },
  {
    id: 952,
    scientific_name: 'Acer floridanum',
    name: 'Florida maple',
    parent_id: 175,
    count: 9,
  },
]

export const getTypeById = (
  id: paths['/types/{id}.json']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/types/${id}.json`))

export const getReviews = (
  locationId: paths['/locations/{id}/reviews.json']['get']['parameters']['path']['id'],
) => handleResponse(instance.get(`/locations/${locationId}/reviews.json`))

export const addReview = (
  locationId: paths['/locations/{id}/review.json']['post']['parameters']['path']['id'],
  params: paths['/locations/{id}/review.json']['post']['parameters']['query'],
  photoData?: File,
) =>
  handleResponse(
    instance.post(
      `/locations/${locationId}/review.json`,
      fileToFormData(photoData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params,
      },
    ),
  )
