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
// TODO: Change api back to normal
export const getLocationById = () => ({
  access: 4,
  address: null,
  author: 'Misaskim',
  city: 'Long Beach',
  state: 'New York',
  country: 'United States',
  description: 'This location is sick',
  id: 1063187,
  lat: 40.586567,
  lng: -73.646377,
  muni: false,
  season_start: null,
  season_stop: null,
  no_season: null,
  type_ids: [14, 15, 16],
  unverified: false,
  created_at: '2015-02-27T22:15:14.575Z',
  updated_at: '2016-12-05T06:11:33.452Z',
  type_names: ['Grape', 'Pear', 'Apple'],
  num_reviews: 0,
  photos: [],
})
export const updateLocation = (
  id: paths['/locations/{id}.json']['post']['parameters']['path']['id'],
  params: paths['/locations/{id}.json']['post']['parameters']['query'],
) =>
  handleResponse(
    instance.post(`/locations/${id}.json`, null, {
      params,
    }),
  )

export const getTypes = () => ({
  id: 14,
  en_name: 'Apple',
  created_at: '2013-01-31T21:15:57.673Z',
  updated_at: '2017-08-29T21:42:00.764Z',
  scientific_name: 'Malus pumila',
  usda_symbol: 'MAPU',
  wikipedia_url: 'http://en.wikipedia.org/wiki/Malus_domestica',
  edibility: '1',
  notes: null,
  en_synonyms: null,
  scientific_synonyms: 'Malus domestica',
  urban_mushrooms_url: null,
  fruitipedia_url: null,
  eat_the_weeds_url: null,
  foraging_texas_url: null,
  parent_id: 114,
  taxonomic_rank: 8,
  es_name: 'Pero',
  he_name: 'תפוח תרבותי',
  pl_name: 'Jabłoń domowa',
  category_mask: 13,
  fr_name: 'Pommier commun',
  pt_br_name: 'Maçã',
  de_name: 'Apfel',
  pending: false,
  it_name: 'Melo',
  el_name: 'Μηλιά',
  sv_name: null,
  tr_name: null,
  nl_name: 'Appel ',
  zh_tw_name: null,
  ar_name: null,
  sk_name: null,
})

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
