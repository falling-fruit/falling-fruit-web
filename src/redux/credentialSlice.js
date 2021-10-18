import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
const initialState = { authToken: undefined }

export const credentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    saveTokenToReduxStore: (state, action) => {
      state.authToken = action.payload
    },
  },
})

export const { saveTokenToReduxStore } = credentialSlice.actions
export default credentialSlice.reducer
