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

export const getClusters = (
  swlng,
  nelng,
  swlat,
  nelat,
  zoom = null,
  muni = null,
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
        muni,
        t: types,
      },
    }),
  )

export const getTypes = () => handleResponse(instance.get('/types.json', {}))
