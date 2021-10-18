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
    return response
  },
)
const initialState = { authToken: undefined }

export const credentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAccessToken.fulfilled, (state, action) => {
      state.authToken = action.payload
    })
  },
})

export const { getToken } = credentialSlice.actions
export default credentialSlice.reducer
