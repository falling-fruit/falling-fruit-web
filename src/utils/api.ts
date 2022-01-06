/* eslint-disable no-console */

import axios from 'axios'

import { paths } from './apiSchema'
import authStore from './authStore'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY,
  },
})

instance.interceptors.request.use((config) => {
  const token = authStore.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token.access_token}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      error.response.data.error === 'Expired access token' &&
      !originalRequest._retry
    ) {
      const token: any = authStore.getToken()

      if (token) {
        originalRequest._retry = true

        const newToken = await refreshUserToken(token.refresh_token)
        authStore.setToken(newToken, token.rememberMe)

        return instance(originalRequest)
      }
    }

    throw error
  },
)

export const addUser = (
  data: paths['/user']['post']['requestBody']['content']['application/json'],
) => instance.post('/user', data)

export const editUser = (
  data: paths['/user']['put']['requestBody']['content']['application/json'],
) => instance.put('/user', data)

export const getUser = () => instance.get('/user')

export const getUserToken = (username: string, password: string) => {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)

  return instance.post('/user/token', formData)
}

export const refreshUserToken = (refreshToken: string) => {
  const formData = new FormData()
  formData.append('refresh_token', refreshToken)

  return instance.post('/user/token/refresh', formData)
}

export const getClusters = (
  params: paths['/clusters']['get']['parameters']['query'],
) => instance.get('/clusters', { params })

export const getLocations = (
  params: paths['/locations']['get']['parameters']['query'],
) => instance.get('/locations', { params })

export const getLocationsCount = (
  params: paths['/locations/count']['get']['parameters']['query'],
) => instance.get('/locations/count', { params })

export const addLocation = (
  data: paths['/locations']['post']['requestBody']['content']['application/json'],
) => instance.post('/locations', data)

export const getLocationById = (
  id: paths['/locations/{id}']['get']['parameters']['path']['id'],
  embed: paths['/locations/{id}']['get']['parameters']['query']['embed'],
) => instance.get(`/locations/${id}`, { params: { embed } })

export const editLocation = (
  id: paths['/locations/{id}']['put']['parameters']['path']['id'],
  data: paths['/locations/{id}']['put']['requestBody']['content']['application/json'],
) => instance.put(`/locations/${id}`, data)

export const getTypes = () => instance.get('/types')

export const getTypeCounts = (
  params: paths['/types/counts']['get']['parameters']['query'],
) => instance.get('/types/counts', { params })

export const getTypeById = (
  id: paths['/types/{id}']['get']['parameters']['path']['id'],
) => instance.get(`/types/${id}`)

export const getReviews = (
  locationId: paths['/locations/{id}/reviews']['get']['parameters']['path']['id'],
) => instance.get(`/locations/${locationId}/reviews`)

export const getReviewById = (
  id: paths['/reviews/{id}']['get']['parameters']['path']['id'],
) => instance.get(`/reviews/${id}`)

export const addReview = (
  locationId: paths['/locations/{id}/reviews']['post']['parameters']['path']['id'],
  data: paths['/locations/{id}/reviews']['post']['requestBody']['content']['application/json'],
) => instance.post(`/locations/${locationId}/reviews`, data)

export const editReview = (
  id: paths['/reviews/{id}']['put']['parameters']['path']['id'],
  data: paths['/reviews/{id}']['put']['requestBody']['content']['application/json'],
) => instance.put(`/reviews/${id}`, data)

export const addPhoto = (
  file: paths['/photos']['post']['requestBody']['content']['multipart/form-data']['file'],
) => {
  const formData = new FormData()
  formData.append('file', file)
  return instance.post('/photos', formData)
}

export const addReport = (
  data: paths['/reports']['post']['requestBody']['content']['application/json'],
) => instance.post('/reports', data)

export const getImports = () => instance.get(`/imports`)

export const getImportById = (
  id: paths['/imports/{id}']['get']['parameters']['path']['id'],
) => instance.get(`/imports/${id}`)
