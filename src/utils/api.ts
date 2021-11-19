/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios'

import { paths } from './apiSchema'

class APIError extends Error {
  name = 'APIError'
}

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  params: {
    key: process.env.REACT_APP_API_KEY,
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

export const getReviews = () =>
  // locationId: paths['/locations/{id}/reviews']['get']['parameters']['path']['id'],
  Promise.resolve([
    {
      id: 2745,
      location_id: 3383,
      user_id: null,
      author: 'Ethan',
      created_at: '2013-12-13T06:09:25.536Z',
      updated_at: '2013-12-30T19:12:03.511Z',
      observed_on: null,
      comment: null,
      fruiting: null,
      quality_rating: 3,
      yield_rating: 2,
      photos: [
        {
          thumb:
            'https://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/thumb/open-uri20131213-3992-1szjh9k.jpg',
          medium:
            'https://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/medium/open-uri20131213-3992-1szjh9k.jpg',
          original:
            'https://s3-us-west-2.amazonaws.com/fallingfruit-production/observations/photos/000/002/745/original/open-uri20131213-3992-1szjh9k.jpg',
        },
      ],
    },
    {
      id: 6179,
      location_id: 3383,
      user_id: 1,
      author: 'Arman',
      created_at: '2014-06-21T19:11:21.382Z',
      updated_at: '2014-06-21T19:11:21.382Z',
      observed_on: '2014-06-19',
      comment: 'pizza is yummy',
      fruiting: 2,
      quality_rating: 2,
      yield_rating: 3,
      photos: [
        {
          thumb:
            'https://jeffreytang.com/static/177133048a37d1510361c98ad9aabbc1/c9c6a/020%20Chicago%203G8A5759.webp',
          medium:
            'https://jeffreytang.com/static/177133048a37d1510361c98ad9aabbc1/c9c6a/020%20Chicago%203G8A5759.webp',
          original:
            'https://jeffreytang.com/static/177133048a37d1510361c98ad9aabbc1/c9c6a/020%20Chicago%203G8A5759.webp',
        },
        {
          thumb:
            'https://jeffreytang.com/static/0e748c63f0b645282075430007645e9c/c9c6a/010%20Whistler%203G8A3467.webp',
          medium:
            'https://jeffreytang.com/static/0e748c63f0b645282075430007645e9c/c9c6a/010%20Whistler%203G8A3467.webp',
          original:
            'https://jeffreytang.com/static/0e748c63f0b645282075430007645e9c/c9c6a/010%20Whistler%203G8A3467.webp',
        },
        {
          thumb:
            'https://jeffreytang.com/static/d32706b879c4d864dc5876afc821a65e/c0e95/030%20Carmel-by-the-Sea%203G8A6620.webp',
          medium:
            'https://jeffreytang.com/static/d32706b879c4d864dc5876afc821a65e/c0e95/030%20Carmel-by-the-Sea%203G8A6620.webp',
          original:
            'https://jeffreytang.com/static/d32706b879c4d864dc5876afc821a65e/c0e95/030%20Carmel-by-the-Sea%203G8A6620.webp',
        },
      ],
    },
    {
      id: 6179,
      location_id: 3383,
      user_id: 1,
      author: 'Arman',
      created_at: '2014-06-21T19:11:21.382Z',
      updated_at: '2014-06-21T19:11:21.382Z',
      observed_on: '2014-06-19',
      comment: 'Hi i am arman',
      fruiting: 2,
      quality_rating: 2,
      yield_rating: 3,
      photos: [
        {
          thumb:
            'https://jeffreytang.com/static/408167ba1df5de2564646ed620cc359a/0d27e/IMG_5714.webp',
          medium:
            'https://jeffreytang.com/static/408167ba1df5de2564646ed620cc359a/0d27e/IMG_5714.webp',
          original:
            'https://jeffreytang.com/static/408167ba1df5de2564646ed620cc359a/0d27e/IMG_5714.webp',
        },
        {
          thumb:
            'https://jeffreytang.com/static/f1911fbf05c836f7eb7ebcbad19b9de3/0d27e/IMG_5667.webp',
          medium:
            'https://jeffreytang.com/static/f1911fbf05c836f7eb7ebcbad19b9de3/0d27e/IMG_5667.webp',
          original:
            'https://jeffreytang.com/static/f1911fbf05c836f7eb7ebcbad19b9de3/0d27e/IMG_5667.webp',
        },
      ],
    },
    {
      id: 47763,
      location_id: 3383,
      user_id: null,
      author: null,
      created_at: '2021-05-20T12:39:28.313Z',
      updated_at: '2021-05-20T12:39:28.313Z',
      observed_on: null,
      comment: 'Ethan is reviewing',
      fruiting: null,
      quality_rating: null,
      yield_rating: null,
      photos: [],
    },
    {
      id: 47764,
      location_id: 3383,
      user_id: null,
      author: null,
      created_at: '2021-05-20T12:39:32.267Z',
      updated_at: '2021-05-20T12:39:32.267Z',
      observed_on: null,
      comment: 'Ethan is reviewing',
      fruiting: null,
      quality_rating: null,
      yield_rating: null,
      photos: [],
    },
  ])

// handleResponse(instance.get(`/locations/${locationId}/reviews`))

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
