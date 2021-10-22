import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserToken } from '../utils/api'

export const fetchAccessToken = createAsyncThunk(
  'users/fetchToken',
  async ({ email, password, isChecked }) => {
    const response = await getUserToken({
      email: email,
      password: password,
    })
    isChecked
      ? localStorage.setItem('authToken', response)
      : sessionStorage.setItem('authToken', response)

    return response
  },
)
const initialState = { authToken: undefined, isChecked: false }

export const credentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    clearAuthCredentials: (state) => {
      state.authToken = undefined
    },
    setAuthFromStorage: (state) => {
      const localAuthToken = localStorage.getItem('authToken')
      const sessionAuthToken = sessionStorage.getItem('authToken')
      state.authToken = localAuthToken ?? sessionAuthToken
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccessToken.fulfilled, (state, { payload }) => {
      state.authToken = payload
    })
  },
})

export const {
  clearAuthCredentials,
  setAuthFromStorage,
} = credentialSlice.actions
export default credentialSlice.reducer
