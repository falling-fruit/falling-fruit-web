import { createAsyncThunk } from '@reduxjs/toolkit'
import {} from 'react-redux'

import { getUserToken } from '../utils/api'

export const fetchAccessToken = createAsyncThunk(
  'users/fetchToken',
  async (userCredentials) => {
    const response = await getUserToken({
      email: userCredentials.email,
      password: userCredentials.password,
    })
    console.log(response)
    return response
  },
)
